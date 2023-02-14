import { uniqueId } from 'lodash'
import React from 'react'
import googleCloudStorage from '../../services/third-party-service/googleCloudStorage'
import constant from '../../utils/constant'
import MyCRUDDataDisplayerHandler from './MyCRUDDataDisplayerHandler'
import { v4 as uuid } from 'uuid'

/**
 * To help cache the change of foreign table fields
 *  add/update/delete: fake change
 *  submit: save all changes into database & firebase storage
 */
class CrudService {
    constructor(serviceKey, service) {
        this.service = service
        this.serviceKey = serviceKey  // unique key for this service(for entity)
        this.children = []
        this.fileServiceMap = new Map() // for one column of entity, which is url of file
        this.parent = null

        //  ** dto.id in addCache is temporary id, !!REMOVE it!! before add to database!
        //  parentId one to many cur_entity, cur_entity many to one childId
        //   POST /api/parent_entity/{parentId}/child_entity/{childId}
        //      parentId和childId只在add的时候确定， 后面update、delete，只会更改id，不会更改parentId和childId
        this.addCache = new Map() // {dto.id: {dto: dto, parentId: id, childId: id} }only for new data

        this.updateCache = new Map() // {dto.id: {newDto: dto, oldDto: dto} } only for original data

        this.removeCache = new Map() // {dto.id: {dto: dto, parentId} } only for original data
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
    _mergeChildrenCache = () => {
        const { addCache, updateCache, removeCache } = this
        const _helper = (serviceList) => {
            serviceList.forEach(service => {
                const { addCache: addCache1, updateCache: updateCache1, removeCache: removeCache1 } = service
                addCache1.forEach((value, key) => {
                    addCache.set(key, value)
                })
                updateCache1.forEach((value, key) => {
                    updateCache.set(key, value)
                })
                removeCache1.forEach((value, key) => {
                    removeCache.set(key, value)
                })
                addCache1.clear()
                updateCache1.clear()
                removeCache1.clear()
                _helper(service.children)
            })
        }
    }

    // post AA/{parentId}/BB/{childId}   AA many to many BB
    // post AA/{parentId}/BB             AA one to many BB
    // add/update/delete: form submit时，暂时保存在当前cache，当parent提交时，合并到parent的cache中
    add = async (dto, parentId, childId) => { // cached add, not to database
        if (!dto.id) { // 就是many to many， 也不该出现id， 因为add的时候加的是join table的记录， 也没有id
            dto.id = uuid() // NOTE: temporary id, **remove it before add to database
        }

        this.addCache.set(dto.id, { dto: dto, parentId: parentId, childId: childId })

        this._mergeChildrenCache() // 合并+清空所有children到parent的cache中
        return dto.id
        // return 'success'
    }
    update = async (dto) => {  // cached update, not to database
        if (!dto.id) {

        } else if (this.addCache.has(dto.id)) {
            this.addCache.get(dto.id).dto = dto
        } else if (this.updateCache.has(dto.id)) {
            this.updateCache.set(dto.id, dto)
        } else if (this.removeCache.has(dto.id)) {
            console.error('update failed, id already exists in removeList', dto)
        } else {
            this.updateCache.set(dto.id, dto)
        }
        this._mergeChildrenCache() // 合并+清空所有children到parent的cache中
        return 'success'
    }
    remove = async (id) => { // cached remove, not to database

        if (this.addCache.has(id)) {
            this.addCache.delete(id)
        } else if (this.updateCache.has(id)) {
            this.updateCache.delete(id)
            this.removeCache.set(id, id)
        } else if (this.removeCache.has(id)) {
            console.error('remove failed, id already exists in removeList', id)
        } else {
            this.removeCache.set(id, id)
        }
        // **不需要合并+清空，因为不出现form，就没有修改children的机会
        return 'success'
    }
    _bottomUpSearchAddCacheContainingId = (id) => {
        const _helper = (crudService) => {
            if (!crudService) return null
            if (crudService.addCache.has(id)) {
                return crudService.addCache
            } else {
                return _helper(crudService.parent)
            }
        }
        return _helper(this)
    }
    _bottomUpSearchUpdateCacheContainingId = (id) => {
        const _helper = (crudService) => {
            if (!crudService) return null
            if (crudService.updateCache.has(id)) {
                return crudService.updateCache
            } else {
                return _helper(crudService.parent)
            }
        }
        return _helper(this)
    }
    _bottomUpSearchRemoveCacheContainingId = (id) => {
        const _helper = (crudService) => {
            if (!crudService) return null
            if (crudService.removeCache.has(id)) {
                return crudService.removeCache
            } else {
                return _helper(crudService.parent)
            }
        }
        return _helper(this)
    }
    get = async (id) => {
        // **search bottom up, the closer is the latest change
        const addCacheContainingId = this._bottomUpSearchAddCacheContainingId(id)
        if (addCacheContainingId) { // new added
            return addCacheContainingId.get(id).dto
        }
        const updateCacheContainingId = this._bottomUpSearchUpdateCacheContainingId(id)
        if (updateCacheContainingId) {
            return updateCacheContainingId.get(id)
        }
        const removeCacheContainingId = this._bottomUpSearchRemoveCacheContainingId(id)
        if (removeCacheContainingId) {
            console.error('get failed, id already exists in removeList', id)
        } else { // get from database
            return (await this.service.get({ id: id })).data
        }
    }
    _originalDataFilter = (data) => {
        return [...data.filter(item => !this._bottomUpSearchRemoveCacheContainingId(item.id)) // dont show fake removed record
            .map(item => {
                const updateCacheContainingId = this._bottomUpSearchUpdateCacheContainingId(item.id)
                if (updateCacheContainingId) {
                    return updateCacheContainingId.get(item.id)
                }
                return item
            })]
    }
    _getGlobalCaches = () => {
        const rootService = this._getRootService()
        const globalAddCache = new Map()
        const globalUpdateCache = new Map()
        const globalRemoveCache = new Map()
        const getAll = (service) => {
            const { addCache, updateCache, removeCache } = service
            addCache.forEach((value, key) => {
                globalAddCache.set(key, value)
            })
            updateCache.forEach((value, key) => {
                globalUpdateCache.set(key, value)
            })
            removeCache.forEach((value, key) => {
                globalRemoveCache.set(key, value)
            })
            service.children.forEach(child => {
                getAll(child)
            })
        }
        getAll(rootService)
        return { globalAddCache, globalUpdateCache, globalRemoveCache }
    }
    getAll = async (parentId) => {
        // if parentId is key in addCache, it's new record, it's children should all be new record in addCache
        const { globalAddCache, globalRemoveCache, globalUpdateCache } = this._getGlobalCaches()

        if (parentId) {
            if (globalAddCache.has(parentId)) {



                const res = [...globalAddCache.values().filter(add => add.parentId === parentId).map(add => add.dto)]

                return res
            }
        }

        let data;
        let cachedAddList = []
        if (parentId) {
            data = (await this.service.getAll({ id: parentId })).data
            cachedAddList = globalAddCache.values().filter(add => add.parentId === parentId).map(add => add.dto)
        } else { // only root service has no parentId, so the current service only one that can get all
            data = (await this.service.getAll()).data
            cachedAddList = this.addCache.values().map(add => add.dto)
        }
        cachedAddList = [...cachedAddList]



        const res = [
            ...this._originalDataFilter(data),
            ...cachedAddList
        ]

        //

        return res
    }
    _addAllToDatabase = async (tmpParentIdToRealParentIdMap) => {
        // add/getAll 需要提供parentId， 用于给子表提供外键, 不需要childId， 取出所有join table的addCache， childId存在于addCache中
        const addFailedList = []
        const promises = []

        const nextTmpParentIdToRealParentIdMap = new Map()
        this.addCache.forEach((props) => { // 别用for of， 应该异步处理每个dto
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
        this.addCache.clear()
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

        this.updateCache.forEach(dto => {
            const promise = this.service.get({ id: dto.id }).then(response => {
                const oldDto = response.data
                return this._saveFiles(dto, oldDto)
            }).then(() => {
                return this.service.updateAll([dto])
            }).catch(e => {
                console.error('update failed', e)
                updateFailedList.push({ dto, oldDto })
            })
            promises.push(promise)
        })
        this.updateCache.clear()
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
        const promises = []
        this.removeCache.forEach(id => {
            const promise = this.service.get({ id }).then(async response => {
                const dto = response.data
                await this._saveFiles(null, dto)
                return this.service.removeAll([dto.id])
            }).catch(e => {
                console.error('remove failed', e)
            })
            promises.push(promise)
        })
        this.removeCache.clear()
        await Promise.all(promises)
        for (const child of this.children) {
            await child._removeAllToDatabase()
        }
        return 'ok'
    }
    submit = async () => { // submit change to database
        if (this.parent) console.error('submit should only be called by root service')
        await this._addAllToDatabase(new Map())
        await this._updateAllToDatabase()
        await this._removeAllToDatabase()
    }
    clearChildren = async () => { // call when form cancelled, since children table will store change in there cache through the opened form
        const children = this.children
        const clearAll = (serviceList) => {
            serviceList.forEach(service => {
                service.addIdList = []
                service.addCache.clear()
                service.updateCache.clear()
                service.removeCache.clear()
                clearAll(service.children)
            })
        }
        clearAll(children)
        return 'ok'
    }
    _getRootService = () => {
        let curService = this
        while (curService && curService.parent) {
            curService = curService.parent
        }
        return curService
    }
}
class CrudManager {
    constructor() {
        this.crudServiceMap = {}
    }
    getCrudService = (serviceKey, service, serviceProps) => {
        let crudService = this.crudServiceMap[serviceKey]
        return crudService
    }
    register = (displayerProps, parent) => {
        const serviceKey = uuid()
        displayerProps.serviceKey = serviceKey
        const service = displayerProps.service
        const crudService = new CrudService(serviceKey, service)
        crudService.parent = parent
        this.crudServiceMap[serviceKey] = crudService

        const editableFields = displayerProps.editableFields
        if (editableFields) {
            editableFields.forEach(field => {
                if (field.displayerProps) { // relational data
                    crudService.children.push(
                        this.register(field.displayerProps, crudService)
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
class __CrudService {
    constructor(serviceKey, service) {
        this.service = service
        this.serviceKey = serviceKey  // unique key for this service(for entity)
        this.children = []
        this.fileServiceMap = new Map() // for one column of entity, which is url of file
        this.parent = null
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
    add = async (dto, parentId, childId) => { // cached add, not to database

        if (dto.id) { // 就是many to many， 也不该出现id， 因为add的时候加的是join table的记录， 也没有id
            console.error('add failed, should not has id', dto)
        } else {
            dto.id = uuid() // NOTE: temporary id, **remove it before add to database
            this.addMap.set(dto.id, { dto: dto, parentId: parentId, childId: childId })
            this.addIdList.push(dto.id)
            return dto.id
        }
        // return 'success'
    }
    update = async (dto, oldDto) => {  // cached update, not to database
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
        // if parentId is key in addMap, it's new record, will not have data in database
        if (parentId && this.addMap.has(parentId)) {
            return this.addMap.values().filter(add => add.parentId === parentId).map(add => add.dto)
        }
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
    clearChildren = async () => {
        const children = this.children
        const clearAll = (serviceList) => {
            serviceList.forEach(service => {
                service.addIdList = []
                service.addMap.clear()
                service.updateMap.clear()
                service.removeMap.clear()
                clearAll(service.children)
            })
        }
        clearAll(children)
        return 'ok'
    }
    _getRootService = () => {
        let curService = this.service
        while (curService && curService.parent) {
            curService = curService.parent
        }
        return curService
    }
    _getGlobalMaps = () => {
        const rootService = this._getRootService()
        const globalAddMap = new Map()
        const globalUpdateMap = new Map()
        const globalRemoveMap = new Map()
        const getAll = (service) => {
            const { addMap, updateMap, removeMap } = service
            addMap.forEach((value, key) => {
                globalAddMap.set(key, value)
            })
            updateMap.forEach((value, key) => {
                globalUpdateMap.set(key, value)
            })
            removeMap.forEach((value, key) => {
                globalRemoveMap.set(key, value)
            })
            service.children.forEach(child => {
                getAll(child)
            })
        }
        getAll(rootService)
        return { globalAddMap, globalUpdateMap, globalRemoveMap }
    }
    _globalGetByAddId = (id) => {
        const rootService = this._getRootService()
        const _search = (service) => {
            const { addMap } = service
            if (addMap.has(id)) {
                return addMap.get(id)
            }
            for (const child of service.children) {
                const result = _search(child)
                if (result) {
                    return result
                }
            }
            return null
        }
        return _search(rootService)
    }
    _globalhasUpdateId = (id) => {
        const rootService = this._getRootService()
        const _search = (service) => {
            const { updateMap } = service
            if (updateMap.has(id)) {
                return true
            }
            for (const child of service.children) {
                const result = _search(child)
                if (result) {
                    return result
                }
            }
            return null
        }
        return _search(rootService)
    }
    _globalhasRemoveId = (id) => {
        const rootService = this._getRootService()
        const _search = (service) => {
            const { removeMap } = service
            if (removeMap.has(id)) {
                return true
            }
            for (const child of service.children) {
                const result = _search(child)
                if (result) {
                    return result
                }
            }
            return null
        }
        return _search(rootService)
    }
}
class __CrudManager {
    constructor() {
        this.crudServiceMap = {}
    }
    getCrudService = (serviceKey, service, serviceProps) => {
        let crudService = this.crudServiceMap[serviceKey]
        return crudService
    }
    register = (displayerProps, parent) => {
        const serviceKey = uuid()
        displayerProps.serviceKey = serviceKey
        const service = displayerProps.service
        service.parent = parent
        const crudService = new CrudService(serviceKey, service)
        this.crudServiceMap[serviceKey] = crudService

        const editableFields = displayerProps.editableFields
        if (editableFields) {
            editableFields.forEach(field => {
                if (field.displayerProps) { // relational data
                    crudService.children.push(
                        this.register(field.displayerProps, service)
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
            dto.id = uuid() // NOTE: temporary id, **remove it before add to database
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
        const serviceKey = uuid()
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
