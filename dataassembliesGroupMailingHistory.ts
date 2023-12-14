interface IHeaders {
  key: string
  name?: string
  width?: string
}

interface IHistoryData {
  file_name?: string
  build_id?: number
  build_name?: string
  build_number?: string
  file_id?: number
}


export interface IBuildBulkImport {
  status: string
  amount: number
  data: IHistoryData[]
}

export const headersSuccess: IHeaders[] = [
  {
    key: 'build_number',
    name: 'Код ПСМ',
  },
  {
    key: 'build_name',
    name: 'Наименование ПСМ',
  },
]

export const headersWarning: IHeaders[] = [
  {
    key: 'file_name',
    name: 'Наименование загружаемого файла',
  },
  {
    key: 'action',
    width: '100px',
  },
]

export const headersError: IHeaders[] = [
  {
    key: 'file_name',
    name: 'Наименование загружаемого файла',
  },
]