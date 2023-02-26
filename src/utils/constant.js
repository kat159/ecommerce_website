export default {
  // Actions
  IDLE: 'idle',
  EDIT: 'edit',
  INSERT: 'insert',
  DELETE: 'delete',
  LOADING: 'loading',

  FILE_SPLIT: '<----->',

  // Relation Types
  ONE_TO_MANY: 'one-to-many',
  MANY_TO_MANY: 'many-to-many',

  // Pagination
  CURRENT_PAGE_STR: 'current',
  PAGE_SIZE_STR: 'pageSize',
  TOTAL_STR: 'total',
  LIST_STR: 'list',
  DEFAULT_PAGE_SIZE: 10,
  INCLUDE: 'include',
  SORT_FIELD_LIST: 'orderFields',
  SORT_ORDER_LIST: 'orderTypes',

  // Data Displayer Components Types
  TABLE: 'table',
  TREE: 'tree',
  EDITABLE_TABLE: 'editable-table',
  EDITABLE_TREE: 'editable-tree',
  TAG_GROUP: 'tag-group',
  LIST: 'list',
  SELECT_TAG_GROUP: 'select-tag-group',
  // Data Editor Components Types
  FORM: 'form',
  POP_FORM: 'pop-form',
  // Data Entry Components Types
  TEXT: 'text',
  TEXTAREA: 'textArea',
  FILE: 'file',
  VIDEO: 'video',
  IMAGE: 'image',
  ICON: 'icon',
  LOGO: 'logo',
  CUSTOM_CONTROLLED_ITEM: 'custom-controlled-item',
  CUSTOM_UNCONTROLLED_ITEM: 'custom-uncontrolled-item',
  MULTI_INPUT: 'multi-input',
  SWITCH: 'switch',
  // CRUD function names
  GET: 'get',
  ADD: 'add',
  UPDATE: 'update',
  REMOVE: 'remove',
  GET_ALL: 'getAll',
  PAGE: 'page',

  // Data Types
  STRING: 'string',
  NUMBER: 'number',
  INTEGER: 'integer',
  POSTIVE_INTEGER: 'postiveInteger',
  DOUBLE: 'double',
  TIMEZONE: 'timezone',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  TIMESTAMP: 'timestamp',
  DATE_RANGE: 'dateRange',
  TIME_RANGE: 'timeRange',
  DATETIME_RANGE: 'datetimeRange',
  TIMESTAMP_RANGE: 'timestampRange',

  // MyImage File Type
  BLOB: 'blob',
  BASE64: 'base64',
}
