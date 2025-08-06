import React, { useState } from 'react'
import { useSettings } from '../../store/settings-store'

const FtpTab = () => {
  const { settings, updateSettings, testFtpConnection } = useSettings()
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleFtpSettingChange = (field, value) => {
    updateSettings({
      ftp: {
        ...settings.ftp,
        [field]: value
      }
    })
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const result = await testFtpConnection(settings.ftp)
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error: error.message })
    } finally {
      setTesting(false)
    }
  }

  const ftpSettings = settings.ftp || {}

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">FTP Upload Settings</h2>
        <p className="text-sm text-gray-600 mb-6">
          Configure FTP settings to automatically upload screenshots and recordings to your server.
          Leave fields empty to disable FTP upload.
        </p>

        <div className="space-y-4">
          {/* Enable FTP */}
          <div className="flex items-center">
            <input
              id="ftp-enabled"
              type="checkbox"
              checked={ftpSettings.enabled || false}
              onChange={(e) => handleFtpSettingChange('enabled', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="ftp-enabled" className="ml-2 text-sm text-gray-700">
              Enable FTP upload
            </label>
          </div>

          {ftpSettings.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-100">
              {/* Host */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FTP Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ftpSettings.host || ''}
                  onChange={(e) => handleFtpSettingChange('host', e.target.value)}
                  placeholder="ftp.example.com"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Port */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value={ftpSettings.port || 21}
                  onChange={(e) => handleFtpSettingChange('port', parseInt(e.target.value) || 21)}
                  placeholder="21"
                  className="block w-32 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ftpSettings.username || ''}
                  onChange={(e) => handleFtpSettingChange('username', e.target.value)}
                  placeholder="your-username"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={ftpSettings.password || ''}
                  onChange={(e) => handleFtpSettingChange('password', e.target.value)}
                  placeholder="your-password"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Remote Path */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remote Path
                </label>
                <input
                  type="text"
                  value={ftpSettings.remotePath || ''}
                  onChange={(e) => handleFtpSettingChange('remotePath', e.target.value)}
                  placeholder="screenshots"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Remote directory where files will be uploaded (optional)
                </p>
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base URL
                </label>
                <input
                  type="url"
                  value={ftpSettings.baseUrl || ''}
                  onChange={(e) => handleFtpSettingChange('baseUrl', e.target.value)}
                  placeholder="https://example.com"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Base URL for generating shareable links to uploaded files
                </p>
              </div>

              {/* Secure Connection */}
              <div className="flex items-center">
                <input
                  id="ftp-secure"
                  type="checkbox"
                  checked={ftpSettings.secure || false}
                  onChange={(e) => handleFtpSettingChange('secure', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="ftp-secure" className="ml-2 text-sm text-gray-700">
                  Use secure connection (FTPS)
                </label>
              </div>

              {/* Test Connection */}
              <div className="pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={testing || !ftpSettings.host || !ftpSettings.username || !ftpSettings.password}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {testing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test Connection</span>
                  )}
                </button>

                {/* Test Results */}
                {testResult && (
                  <div className={`mt-3 p-3 rounded-md ${
                    testResult.success 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {testResult.success ? (
                          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">
                          {testResult.success 
                            ? 'Connection successful! FTP settings are working correctly.' 
                            : `Connection failed: ${testResult.error}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Security Note:</h4>
          <p className="text-xs text-blue-700">
            FTP credentials are stored securely using your operating system's keychain. 
            However, FTP transmits data in plain text unless you enable secure connection (FTPS). 
            Consider using SFTP for better security (coming in future updates).
          </p>
        </div>
      </div>
    </div>
  )
}

export default FtpTab
