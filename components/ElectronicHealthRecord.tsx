'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useHealthStore, HealthRecordFile } from '@/lib/store'
import { Upload, FileText, X, Download, Image, File, Trash2 } from 'lucide-react'

interface HealthRecord {
  id: string
  date: string
  condition: string
  symptoms: string[]
  medications: string[]
  notes: string
  moodScore?: number
  emotionDetected?: string
  files?: HealthRecordFile[] // Files attached to this record
}

export default function ElectronicHealthRecord() {
  const { user, healthRecordFiles, addHealthRecordFile, removeHealthRecordFile } = useHealthStore()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    symptoms: [],
    medications: [],
    files: []
  })
  const [isAdding, setIsAdding] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingRecordFiles, setIsUploadingRecordFiles] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recordFileInputRef = useRef<HTMLInputElement>(null)

  // Load records and files from user-specific storage
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true)
      // Use setTimeout to prevent blocking the UI
      setTimeout(() => {
        try {
          // Load records
          const savedRecords = localStorage.getItem(`health-records-${user.id}`)
          if (savedRecords) {
            const parsed = JSON.parse(savedRecords)
            setRecords(Array.isArray(parsed) ? parsed : [])
          } else {
            setRecords([])
          }
        } catch (error) {
          console.error('Error loading records:', error)
          setRecords([])
        } finally {
          setIsLoading(false)
        }
      }, 100) // Small delay to prevent UI freeze
    } else {
      setIsLoading(false)
    }
  }, [user?.id]) // Only depend on user.id to avoid re-renders

  // Save records to user-specific storage (debounced)
  useEffect(() => {
    if (user?.id && records.length >= 0) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(`health-records-${user.id}`, JSON.stringify(records))
          // Only save user data if records changed, not on every render
        } catch (error) {
          console.error('Error saving records:', error)
        }
      }, 500) // Debounce saves
      
      return () => clearTimeout(timeoutId)
    }
  }, [records, user?.id]) // Only depend on records and user.id

  const addRecord = () => {
    if (!newRecord.condition) return

    const record: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      condition: newRecord.condition || '',
      symptoms: newRecord.symptoms || [],
      medications: newRecord.medications || [],
      notes: newRecord.notes || '',
      moodScore: newRecord.moodScore,
      emotionDetected: newRecord.emotionDetected,
      files: newRecord.files || [] // Include files with the record
    }

    setRecords(prev => [record, ...prev])
    setNewRecord({ symptoms: [], medications: [], files: [] })
    setIsAdding(false)
  }

  const handleRecordFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !user) return

    setIsUploadingRecordFiles(true)

    try {
      const uploadPromises = Array.from(files).map((file) => {
        return new Promise<HealthRecordFile>((resolve, reject) => {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
            reject(new Error(`File too large: ${file.name}`))
            return
          }

          // Convert file to base64
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            
            const healthFile: HealthRecordFile = {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
              dataUrl: dataUrl
            }

            resolve(healthFile)
          }
          
          reader.onerror = () => {
            console.error('Error reading file:', file.name)
            reject(new Error(`Failed to read file: ${file.name}`))
          }
          
          reader.readAsDataURL(file)
        })
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      
      // Add files to the new record
      setNewRecord(prev => ({
        ...prev,
        files: [...(prev.files || []), ...uploadedFiles]
      }))
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setIsUploadingRecordFiles(false)
      if (recordFileInputRef.current) {
        recordFileInputRef.current.value = ''
      }
    }
  }

  const removeRecordFile = (fileId: string) => {
    setNewRecord(prev => ({
      ...prev,
      files: (prev.files || []).filter(f => f.id !== fileId)
    }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !user) return

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map((file) => {
        return new Promise<void>((resolve, reject) => {
          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            alert(`File "${file.name}" is too large. Maximum size is 10MB.`)
            resolve()
            return
          }

          // Convert file to base64
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            
            const healthFile: HealthRecordFile = {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadedAt: new Date().toISOString(),
              dataUrl: dataUrl
            }

            addHealthRecordFile(healthFile)
            resolve()
          }
          
          reader.onerror = () => {
            console.error('Error reading file:', file.name)
            reject(new Error(`Failed to read file: ${file.name}`))
          }
          
          reader.readAsDataURL(file)
        })
      })

      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDownloadFile = (file: HealthRecordFile) => {
    const link = document.createElement('a')
    link.href = file.dataUrl
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      removeHealthRecordFile(fileId)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    return File
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading health records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Health Records</h2>
          <p className="text-gray-600">Store and manage your health records and documents</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Add Record
          </motion.button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
        aria-label="Upload health record files"
        title="Upload health record files"
      />

      {/* Uploaded Files Section */}
      {healthRecordFiles.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Uploaded Files ({healthRecordFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthRecordFiles.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Record Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 border-2 border-primary/20 rounded-xl bg-primary/5"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Health Record</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <input
                type="text"
                value={newRecord.condition || ''}
                onChange={e => setNewRecord(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Enter condition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms (comma-separated)
              </label>
              <input
                type="text"
                value={newRecord.symptoms?.join(', ') || ''}
                onChange={e => setNewRecord(prev => ({ 
                  ...prev, 
                  symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Enter symptoms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medications (comma-separated)
              </label>
              <input
                type="text"
                value={newRecord.medications?.join(', ') || ''}
                onChange={e => setNewRecord(prev => ({ 
                  ...prev, 
                  medications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                placeholder="Enter medications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newRecord.notes || ''}
                onChange={e => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                rows={4}
                placeholder="Enter additional notes"
              />
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Files (Optional)
              </label>
              <div className="flex items-center gap-3 mb-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => recordFileInputRef.current?.click()}
                  disabled={isUploadingRecordFiles}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isUploadingRecordFiles ? 'Uploading...' : 'Upload Files'}
                </motion.button>
                <input
                  ref={recordFileInputRef}
                  type="file"
                  multiple
                  onChange={handleRecordFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                  aria-label="Upload files for this record"
                  title="Upload files for this record"
                />
                {newRecord.files && newRecord.files.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {newRecord.files.length} file(s) attached
                  </span>
                )}
              </div>
              
              {/* Display attached files */}
              {newRecord.files && newRecord.files.length > 0 && (
                <div className="space-y-2 mt-3">
                  {newRecord.files.map((file) => {
                    const FileIcon = getFileIcon(file.type)
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <FileIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRecordFile(file.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addRecord}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex-1"
              >
                Save Record
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsAdding(false)
                  setNewRecord({ symptoms: [], medications: [], files: [] })
                }}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Records List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Health Records ({records.length})
        </h3>
        {records.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No health records yet</p>
            <p className="text-sm text-gray-500">Click "Add Record" to create your first health record</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{record.condition}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                    {record.date}
                  </span>
                </div>
                
                {record.symptoms.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-sm font-semibold text-gray-700">Symptoms: </strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {record.symptoms.map((symptom, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {record.medications.length > 0 && (
                  <div className="mb-3">
                    <strong className="text-sm font-semibold text-gray-700">Medications: </strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {record.medications.map((med, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {record.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <strong className="text-sm font-semibold text-gray-700">Notes: </strong>
                    <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                  </div>
                )}

                {record.moodScore !== undefined && (
                  <div className="mt-3 flex items-center gap-2">
                    <strong className="text-sm font-semibold text-gray-700">Mood Score: </strong>
                    <span className="text-sm font-bold text-primary">{record.moodScore}/100</span>
                    {record.emotionDetected && (
                      <span className="text-sm text-gray-600">({record.emotionDetected})</span>
                    )}
                  </div>
                )}

                {/* Display attached files */}
                {record.files && record.files.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <strong className="text-sm font-semibold text-gray-700 mb-2 block">
                      Attached Files ({record.files.length}):
                    </strong>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {record.files.map((file) => {
                        const FileIcon = getFileIcon(file.type)
                        return (
                          <div
                            key={file.id}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <FileIcon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate text-sm" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = file.dataUrl
                                link.download = file.name
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }}
                              className="text-primary hover:text-primary/80 p-1"
                              title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
