import { isArray } from '@daily-fun/shared'

export interface UploadOptions {
  action: string
  method: string
  data: Record<string, string | Blob | [Blob, string]>
  filename: string
  file: UploadRawFile
  headers: Headers | Record<string, string | number | null | undefined>
  onError: (evt: Error) => void
  onProgress: (evt: UploadProgressEvent) => void
  onSuccess: (response: any) => void
  withCredentials: boolean
}

export interface UploadRawFile extends File {
  uid: number
  isDirectory?: boolean
}

export interface UploadProgressEvent extends ProgressEvent {
  percent?: number
}

export class UploadAjaxError extends Error {
  name = 'UploadAjaxError'
  status: number
  method: string
  url: string

  constructor(message: string, status: number, method: string, url: string) {
    super(message)
    this.status = status
    this.method = method
    this.url = url
  }
}

function getError(
  action: string,
  option: UploadOptions,
  xhr: XMLHttpRequest,
) {
  let msg: string
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  }
  else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  }
  else {
    msg = `fail to ${option.method} ${action} ${xhr.status}`
  }

  return new UploadAjaxError(msg, xhr.status, option.method, action)
}

function isNil(value: string | number | null | undefined): boolean {
  return value === null || value === undefined
}

function getBody(xhr: XMLHttpRequest): XMLHttpRequestResponseType {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  }
  catch {
    return text
  }
}

export function ajaxUpload(options: UploadOptions) {
  const { method, action, data, filename, file, withCredentials, onProgress, onError, onSuccess } = options
  const xhr = new XMLHttpRequest()

  if (xhr.upload) {
    xhr.upload.addEventListener('progress', (event) => {
      const progressEvent: UploadProgressEvent = event
      progressEvent.percent = event.total > 0 ? (event.loaded / event.total) * 100 : 0
      onProgress(progressEvent)
    })
  }

  const formData = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (isArray(value) && value.length)
        formData.append(key, ...value)
      else
        formData.append(key, value)
    }
  }

  formData.append(filename, file, file.name)

  xhr.addEventListener('error', () => {
    onError(getError(action, options, xhr))
  })

  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return onError(getError(action, options, xhr))
    }
    onSuccess(getBody(xhr))
  })

  xhr.open(method, action, true)

  if (withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = options.headers || {}
  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value))
  }
  else {
    for (const [key, value] of Object.entries(headers)) {
      if (isNil(value))
        continue
      xhr.setRequestHeader(key, String(value))
    }
  }

  xhr.send(formData)
  return xhr
}
