import { uniqueId } from 'lodash'
import React from 'react'
import googleCloudStorage from '../../services/third-party-service/googleCloudStorage'
import constant from '../../utils/constant'
import MyCRUDDataDisplayerHandler from './MyCRUDDataDisplayerHandler'


/**
 * To help cache the change of foreign table fields
 *  add/update/delete: fake change
 *  submit: save all changes into database & firebase storage
 */
class CrudCache {
    constructor() {
        this.addIdList = [] // [dto.id]， to insure the order of addlist
        this.addMap = new Map() // {dto.id: {dto: dto, parentId: id, childId: id} }only for new data
        this.updateMap = new Map() // {dto.id: {dto: dto, parentId: id, childId: id} } only for original data
        this.removeMap = new Map() // {dto.id: {dto: dto, parentId: id, childId: id} } only for original data
    }
    // post AA/{parentId}/BB/{childId}   AA many to many BB
    // post AA/{parentId}/BB             AA one to many BB
    add = async (dto, parentId, childId) => { // called when complete adding, eg. form submit
        if (dto.id) { // 就是many to many， 也不该出现id， 因为add的时候加的是join table的记录， 也没有id
            console.error('add failed, should not has id', dto)
            return null
        } else {
            dto.id = uniqueId('dto-tmp-id-') // NOTE: temporary id, **remove it before add to database
            this.addMap.set(dto.id, { dto: dto, parentId: parentId, childId: childId })
            this.addIdList.push(dto.id)
            return dto.id
        }

    }
    update = async (dto, oldDto) => {  // called when complete updating, eg. form submit
        if (!dto.id) dto.id = oldDto.id
        if (this.addMap.has(dto.id)) { // new record, not in database
            // update should not change parentId and childId
            this.addMap.get(dto.id).dto = dto
        } else if (this.updateMap.has(dto.id)) { // original record, has been updated multiple times
            // non-first-time update should not change oldDto 
            this.updateMap.get(dto.id).newDto = dto
        } else if (this.removeMap.has(dto.id)) {
            console.error('update failed, id already exists in removeList', dto)
        } else { // original record, first time to update
            this.updateMap.set(dto.id, { newDto: dto, oldDto: oldDto })
        }
        return 'success'
    }
    remove = async (dto, parentId) => { // should be dto not id, so can remove files when submit, without request from backend again

        const id = dto.id
        if (this.addMap.has(id)) { // new record, not in database
            this.addIdList = this.addIdList.filter(addId => addId !== id)
            this.addMap.delete(id)
        } else if (this.updateMap.has(id)) { // original record
            this.updateMap.delete(id)
            this.removeMap.set(id, { dto: dto, parentId: parentId })
        } else if (this.removeMap.has(id)) {
            console.error('remove failed, id already exists in removeList', id)
        } else { // original record
            this.removeMap.set(id, { dto: dto, parentId: parentId })
        }
        return 'success'
    }
    get = async (id) => {
        if (this.addMap.has(id)) {
            return this.addMap.get(id)
        } else if (this.updateMap.has(id)) {
            const { newDto, oldDto } = this.updateMap.get(id)
            return {
                ...oldDto,
                ...newDto, // 没法修改的字段用oldDto的值， 比如create_date
            }
        } else if (this.removeMap.has(id)) {
            console.error('get failed, id already exists in removeList', id)
        } else {
            return (await this.service.get({ id: id })).data
        }
    }
    _originalDataFilter = (data) => {
        return data.filter(item => !this.removeMap.has(item.id)) // dont show fake removed record
            .map(item => {
                if (this.updateMap.has(item.id)) {  // show fake updated record instead of original record

                    const { newDto, oldDto } = this.updateMap.get(item.id)
                    return {
                        ...oldDto,
                        ...newDto, // 没法修改的字段用oldDto的值， 比如create_date
                    }
                }
                return item
            })
    }
    getAll = async (parentId) => {
        let data;
        let cachedAddList = []
        let cachedRemoveList = []
        if (parentId) {
            data = (await this.service.getAll({ id: parentId })).data
            // cachedAddList = Object.values(this.addMap).filter(add => add.parentId === parentId).map(add => add.dto)
            cachedAddList = this.addMap.values().filter(add => add.parentId === parentId).map(add => add.dto)
            cachedRemoveList = this.removeMap.values().filter(remove => remove.parentId === parentId).map(remove => remove.dto)
        } else {
            data = (await this.service.getAll()).data
            cachedAddList = this.addMap.values().map(add => add.dto)
            cachedRemoveList = this.removeMap.values().filter(remove => remove.parentId === parentId).map(remove => remove.dto)
        }


        if (data[constant.PAGE_SIZE_STR]
            && data[constant.CURRENT_PAGE_STR]
            && data[constant.TOTAL_STR]) {// it's a pagination result, dataList stored in data.list

            const list = data.list
            list = this._originalDataFilter(list)
            for (dto of cachedAddList) {
                if (list.length < data[constant.PAGE_SIZE_STR]) {
                    list.push(dto)
                } else {
                    break
                }
            }
            const curTotal = data[constant.TOTAL_STR] + cachedAddList.length - cachedRemoveList.length
            const pageSize = data[constant.PAGE_SIZE_STR]
            let curPage = data[constant.CURRENT_PAGE_STR]
            const totalPage = Math.ceil(curTotal / pageSize)
            if (curPage > totalPage) {
                curPage = totalPage
            }
            return {
                ...data,
                list: list,
                [constant.TOTAL_STR]: curTotal,
                [constant.CURRENT_PAGE_STR]: curPage
            }
        } else {
            // it's a real getAll result, dataList stored just as data   
            return [
                ...this._originalDataFilter(data),
                ...cachedAddList
            ]
        }
    }
    _addAllToDatabase = async (tmpParentIdToRealParentIdMap) => {
        // add/getAll 需要提供parentId， 用于给子表提供外键, 不需要childId， 取出所有join table的addMap， childId存在于addMap中
        const addFailedList = []
        const promises = []

        const nextTmpParentIdToRealParentIdMap = new Map()
        this.addMap.forEach((props) => { // 别用for of， 应该异步处理每个dto
            let { dto, childId, parentId } = props
            if (tmpParentIdToRealParentIdMap.has(parentId)) {
                parentId = tmpParentIdToRealParentIdMap.get(parentId)
            }
            const promise = this._saveFiles(dto).then(() => {
                const { id: tmpId, ...rest } = dto
                let addPromoise;
                if (parentId) {
                    if (childId) // many to many join table
                        addPromoise = this.service.addAll({ id: parentId, cid: childId }, [rest])
                    else // one to many
                        addPromoise = this.service.addAll({ id: parentId }, [rest])
                } else {
                    addPromoise = this.service.addAll([rest])
                }
                return addPromoise.then((response) => {
                    const [realId] = response.data
                    return nextTmpParentIdToRealParentIdMap.set(tmpId, realId)
                })

            }).catch(e => {
                console.error('add failed111', e)
                addFailedList.push({ dto, parentId, childId })
            })
            promises.push(promise)
        })
        this.addMap.clear()
        this.addIdList = []
        await Promise.all(promises)
        if (addFailedList.length > 0) {
            console.error('add failed list', addFailedList)
        }
        for (const child of this.children) {
            await child._addAllToDatabase(nextTmpParentIdToRealParentIdMap)
        }
        return 'ok'
    }
    _updateAllToDatabase = async () => { // update/delete 都是original data， 不需要提供parentId，独立于addAllToDatabase
        const updateFailedList = []
        const promises = []
        this.updateMap.forEach(({ newDto, oldDto }) => {
            const promise = this._saveFiles(newDto, oldDto).then(() => {
                return this.service.updateAll([newDto])
            }).catch(e => {
                console.error('update failed', e)
                updateFailedList.push({ newDto, oldDto })
            })
            promises.push(promise)
        })
        this.updateMap.clear()
        await Promise.all(promises)
        if (updateFailedList.length > 0) {
            console.error('update failed list', updateFailedList)
        }
        for (const child of this.children) {
            await child._updateAllToDatabase()
        }
        return 'ok'

    }
    _removeAllToDatabase = async () => { // update/delete 都是original data， 不需要提供parentId，独立于addAllToDatabase
        const removeFailedList = []
        const promises = []

        this.removeMap.forEach(({ dto }) => {
            const promise = this._saveFiles(null, dto).then(() => {

                return this.service.removeAll([dto.id])
            }).catch(e => {
                console.error('remove failed', e)
                removeFailedList.push(dto)
            })
            promises.push(promise)
        })
        this.removeMap.clear()
        await Promise.all(promises)
        if (removeFailedList.length > 0) {
            console.error('remove failed list', removeFailedList)
        }
        for (const child of this.children) {
            await child._removeAllToDatabase()
        }
        return 'ok'
    }

    submit = async () => { // 一但在这一层触发submit， 说明每次对不同的parentId都会触发submit， 所以不需要考虑parentId的问题

        await this._addAllToDatabase(new Map())
        await this._updateAllToDatabase()
        await this._removeAllToDatabase()
    }
    cancel = async () => {
        const clearAllChildren = (crudService) => {
            crudService.addMap.clear()
            crudService.addIdList = []

            crudService.updateMap.clear()
            crudService.removeMap.clear()
            for (const child of this.children) {
                clearAllChildren(child)
            }
        }
        clearAllChildren(this)
        return 'ok'
    }
}
class CrudManager {
    constructor() {
        this.cacheLink = []  // [{id: id, cache: CrudCache}]
    }
    register = (id, editType) => {
        const cache = CrudCache()
        this.cacheLink.push({ id, cache })
    }
    add = (dto)
}
class _CrudService {
    constructor(serviceKey, service) {
        this.service = service
        this.serviceKey = serviceKey  // unique key for this service(for entity)
        this.children = []
        this.fileServiceMap = new Map() // for one column of entity, which is url of file

        this.addIdList = [] // [dto.id]， to insure the order of addlist

        //  ** dto.id in addMap is temporary id, !!REMOVE it!! before add to database!
        //  parentId one to many cur_entity, cur_entity many to one childId
        //   POST /api/parent_entity/{parentId}/child_entity/{childId}
        //      parentId和childId只在add的时候确定， 后面update、delete，只会更改id，不会更改parentId和childId
        this.addMap = new Map() // {dto.id: {dto: dto, parentId: id, childId: id} }only for new data

        this.updateMap = new Map() // {dto.id: {newDto: dto, oldDto: dto} } only for original data

        this.removeMap = new Map() // {dto.id: {dto: dto, parentId} } only for original data
        // uniqueId('crud-cache-')
    }
    __saveFileList = async (newFileList, oldFileList, fileService) => {
        const newFileSet = new Set(newFileList)
        const oldFileSet = new Set(oldFileList)


        const toBeDeleted = oldFileList.filter(file => !newFileSet.has(file))

        const newUrlList = []
        const promises = []
        // 在每个独立promise后面加个catch， 就不会打断promise.all
        toBeDeleted.forEach(file => {
            promises.push(fileService.remove(file).catch(e => { console.error('remove failed', e) }))
        })
        newFileList.forEach(file => {
            if (!oldFileSet.has(file)) {
                promises.push(
                    fileService.add(file).then(url => {
                        newUrlList.push(url)
                    }).catch(e => { console.error('add file failed', e) })
                )
            } else {
                newUrlList.push(file)
            }
        })
        await Promise.all(promises)
        return newUrlList
    }
    _saveFiles = async (dto, oldDto) => {
        const promises = []
        Object.keys(dto ? dto : oldDto).forEach((key) => {

            if (this.fileServiceMap.has(key)) {
                const fileService = this.fileServiceMap.get(key)

                const newFileList = dto ? dto[key] ? dto[key].split(constant.FILE_SPLIT) : [] : []
                const oldFileList = oldDto ? oldDto[key] ? oldDto[key].split(constant.FILE_SPLIT) : [] : []


                promises.push(
                    this.__saveFileList(newFileList, oldFileList, fileService)
                        .then((newUrlList) => {
                            if (dto) dto[key] = newUrlList.join(constant.FILE_SPLIT)



                        }).catch(e => { console.error('saveFiles failed', e) })
                )
            }
        })
        const results = await Promise.all(promises)
        return results
    }
    // post AA/{parentId}/BB/{childId}   AA many to many BB
    // post AA/{parentId}/BB             AA one to many BB
    add = async (dto, parentId, childId) => { // called when complete adding, eg. form submit

        if (dto.id) { // 就是many to many， 也不该出现id， 因为add的时候加的是join table的记录， 也没有id
            console.error('add failed, should not has id', dto)
        } else {
            dto.id = uniqueId('dto-tmp-id-') // NOTE: temporary id, **remove it before add to database
            this.addMap.set(dto.id, { dto: dto, parentId: parentId, childId: childId })
            this.addIdList.push(dto.id)
        }
        return 'success'
    }
    update = async (dto, oldDto) => {  // called when complete updating, eg. form submit
        if (!dto.id) dto.id = oldDto.id
        if (this.addMap.has(dto.id)) { // new record, not in database
            // update should not change parentId and childId
            this.addMap.get(dto.id).dto = dto
        } else if (this.updateMap.has(dto.id)) { // original record, has been updated multiple times
            // non-first-time update should not change oldDto 
            this.updateMap.get(dto.id).newDto = dto
        } else if (this.removeMap.has(dto.id)) {
            console.error('update failed, id already exists in removeList', dto)
        } else { // original record, first time to update
            this.updateMap.set(dto.id, { newDto: dto, oldDto: oldDto })
        }
        return 'success'
    }
    remove = async (dto, parentId) => { // should be dto not id, so can remove files when submit, without request from backend again

        const id = dto.id
        if (this.addMap.has(id)) { // new record, not in database
            this.addIdList = this.addIdList.filter(addId => addId !== id)
            this.addMap.delete(id)
        } else if (this.updateMap.has(id)) { // original record
            this.updateMap.delete(id)
            this.removeMap.set(id, { dto: dto, parentId: parentId })
        } else if (this.removeMap.has(id)) {
            console.error('remove failed, id already exists in removeList', id)
        } else { // original record
            this.removeMap.set(id, { dto: dto, parentId: parentId })
        }
        return 'success'
    }
    get = async (id) => {
        if (this.addMap.has(id)) {
            return this.addMap.get(id)
        } else if (this.updateMap.has(id)) {
            const { newDto, oldDto } = this.updateMap.get(id)
            return {
                ...oldDto,
                ...newDto, // 没法修改的字段用oldDto的值， 比如create_date
            }
        } else if (this.removeMap.has(id)) {
            console.error('get failed, id already exists in removeList', id)
        } else {
            return (await this.service.get({ id: id })).data
        }
    }
    _originalDataFilter = (data) => {
        return data.filter(item => !this.removeMap.has(item.id)) // dont show fake removed record
            .map(item => {
                if (this.updateMap.has(item.id)) {  // show fake updated record instead of original record

                    const { newDto, oldDto } = this.updateMap.get(item.id)
                    return {
                        ...oldDto,
                        ...newDto, // 没法修改的字段用oldDto的值， 比如create_date
                    }
                }
                return item
            })
    }
    getAll = async (parentId) => {
        let data;
        let cachedAddList = []
        let cachedRemoveList = []
        if (parentId) {
            data = (await this.service.getAll({ id: parentId })).data
            // cachedAddList = Object.values(this.addMap).filter(add => add.parentId === parentId).map(add => add.dto)
            cachedAddList = this.addMap.values().filter(add => add.parentId === parentId).map(add => add.dto)
            cachedRemoveList = this.removeMap.values().filter(remove => remove.parentId === parentId).map(remove => remove.dto)
        } else {
            data = (await this.service.getAll()).data
            cachedAddList = this.addMap.values().map(add => add.dto)
            cachedRemoveList = this.removeMap.values().filter(remove => remove.parentId === parentId).map(remove => remove.dto)
        }


        if (data[constant.PAGE_SIZE_STR]
            && data[constant.CURRENT_PAGE_STR]
            && data[constant.TOTAL_STR]) {// it's a pagination result, dataList stored in data.list

            const list = data.list
            list = this._originalDataFilter(list)
            for (dto of cachedAddList) {
                if (list.length < data[constant.PAGE_SIZE_STR]) {
                    list.push(dto)
                } else {
                    break
                }
            }
            const curTotal = data[constant.TOTAL_STR] + cachedAddList.length - cachedRemoveList.length
            const pageSize = data[constant.PAGE_SIZE_STR]
            let curPage = data[constant.CURRENT_PAGE_STR]
            const totalPage = Math.ceil(curTotal / pageSize)
            if (curPage > totalPage) {
                curPage = totalPage
            }
            return {
                ...data,
                list: list,
                [constant.TOTAL_STR]: curTotal,
                [constant.CURRENT_PAGE_STR]: curPage
            }
        } else {
            // it's a real getAll result, dataList stored just as data   
            return [
                ...this._originalDataFilter(data),
                ...cachedAddList
            ]
        }
    }
    _addAllToDatabase = async (tmpParentIdToRealParentIdMap) => {
        // add/getAll 需要提供parentId， 用于给子表提供外键, 不需要childId， 取出所有join table的addMap， childId存在于addMap中
        const addFailedList = []
        const promises = []

        const nextTmpParentIdToRealParentIdMap = new Map()
        this.addMap.forEach((props) => { // 别用for of， 应该异步处理每个dto
            let { dto, childId, parentId } = props
            if (tmpParentIdToRealParentIdMap.has(parentId)) {
                parentId = tmpParentIdToRealParentIdMap.get(parentId)
            }
            const promise = this._saveFiles(dto).then(() => {
                const { id: tmpId, ...rest } = dto
                let addPromoise;
                if (parentId) {
                    if (childId) // many to many join table
                        addPromoise = this.service.addAll({ id: parentId, cid: childId }, [rest])
                    else // one to many
                        addPromoise = this.service.addAll({ id: parentId }, [rest])
                } else {
                    addPromoise = this.service.addAll([rest])
                }
                return addPromoise.then((response) => {
                    const [realId] = response.data
                    return nextTmpParentIdToRealParentIdMap.set(tmpId, realId)
                })

            }).catch(e => {
                console.error('add failed111', e)
                addFailedList.push({ dto, parentId, childId })
            })
            promises.push(promise)
        })
        this.addMap.clear()
        this.addIdList = []
        await Promise.all(promises)
        if (addFailedList.length > 0) {
            console.error('add failed list', addFailedList)
        }
        for (const child of this.children) {
            await child._addAllToDatabase(nextTmpParentIdToRealParentIdMap)
        }
        return 'ok'
    }
    _updateAllToDatabase = async () => { // update/delete 都是original data， 不需要提供parentId，独立于addAllToDatabase
        const updateFailedList = []
        const promises = []
        this.updateMap.forEach(({ newDto, oldDto }) => {
            const promise = this._saveFiles(newDto, oldDto).then(() => {
                return this.service.updateAll([newDto])
            }).catch(e => {
                console.error('update failed', e)
                updateFailedList.push({ newDto, oldDto })
            })
            promises.push(promise)
        })
        this.updateMap.clear()
        await Promise.all(promises)
        if (updateFailedList.length > 0) {
            console.error('update failed list', updateFailedList)
        }
        for (const child of this.children) {
            await child._updateAllToDatabase()
        }
        return 'ok'

    }
    _removeAllToDatabase = async () => { // update/delete 都是original data， 不需要提供parentId，独立于addAllToDatabase
        const removeFailedList = []
        const promises = []

        this.removeMap.forEach(({ dto }) => {
            const promise = this._saveFiles(null, dto).then(() => {

                return this.service.removeAll([dto.id])
            }).catch(e => {
                console.error('remove failed', e)
                removeFailedList.push(dto)
            })
            promises.push(promise)
        })
        this.removeMap.clear()
        await Promise.all(promises)
        if (removeFailedList.length > 0) {
            console.error('remove failed list', removeFailedList)
        }
        for (const child of this.children) {
            await child._removeAllToDatabase()
        }
        return 'ok'
    }

    submit = async () => { // 一但在这一层触发submit， 说明每次对不同的parentId都会触发submit， 所以不需要考虑parentId的问题

        await this._addAllToDatabase(new Map())
        await this._updateAllToDatabase()
        await this._removeAllToDatabase()
    }
    cancel = async () => {
        const clearAllChildren = (crudService) => {
            crudService.addMap.clear()
            crudService.addIdList = []

            crudService.updateMap.clear()
            crudService.removeMap.clear()
            for (const child of this.children) {
                clearAllChildren(child)
            }
        }
        clearAllChildren(this)
        return 'ok'
    }
}

class _CrudManager {
    constructor() {
        this.crudServiceMap = {}
    }
    getCrudService = (serviceKey, service, serviceProps) => {
        let crudService = this.crudServiceMap[serviceKey]
        return crudService
    }
    register = (displayerProps) => {
        const serviceKey = uniqueId('service-key-')
        displayerProps.serviceKey = serviceKey
        const service = displayerProps.service
        const crudService = new CrudService(serviceKey, service)
        this.crudServiceMap[serviceKey] = crudService

        const editableFields = displayerProps.editableFields
        if (editableFields) {
            editableFields.forEach(field => {
                if (field.displayerProps) { // relational data
                    crudService.children.push(
                        this.register(field.displayerProps)
                    )
                } else if (field.addFile) { // file data
                    crudService.fileServiceMap.set(
                        field.dataFieldName,
                        {
                            add: field.addFile,
                            remove: field.deleteFile,
                        }
                    )
                }
            })
        }
        return crudService
    }
}

export default function RelationalCRUDEntry(displayerProps) {
    const crudManager = new CrudManager()
    crudManager.register(displayerProps)
    return (
        <div>
            <MyCRUDDataDisplayerHandler
                {...displayerProps}
                crudManager={crudManager}
            />
        </div>
    )
}
