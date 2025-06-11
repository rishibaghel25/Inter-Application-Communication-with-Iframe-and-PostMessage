import React, { useState, useRef } from 'react';
import { ChevronDown, Send, Home, ExternalLink } from 'lucide-react';

const MasterApp = () => {
  const [selectedApp, setSelectedApp] = useState('home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sharedMessage, setSharedMessage] = useState('');
  const [messageToSend, setMessageToSend] = useState('');
  const iframeRef = useRef(null);

  const apps = [
    { id: 'home', name: 'Home', path: null },
    { id: 'costsense', name: 'SimpleTextCompare', path: './Child1/index.html' },
    { id: 'timestamplab', name: 'TimestampLab', path: './Child2/index.html' }
  ];

  const handleAppSelect = (appId) => {
    setSelectedApp(appId);
    setIsDropdownOpen(false);
  };

  const handleSendMessage = () => {
    if (messageToSend.trim() && iframeRef.current) {
      setSharedMessage(messageToSend);
      
      // Send message to iframe
      iframeRef.current.contentWindow.postMessage({
        type: 'SHARED_MESSAGE',
        message: messageToSend
      }, '*');
      
      setMessageToSend('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const currentApp = apps.find(app => app.id === selectedApp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800">MyProjects</span>
              </div>
            </div>

            {/* App Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {currentApp?.name || 'Select App'}
                <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {apps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleAppSelect(app.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          selectedApp === app.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter shared message..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageToSend.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      
        {selectedApp === 'home' ? (
          <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to MyProjects
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Select an application from the dropdown to get started
              </p>
              
              {sharedMessage && (
                <div className="mb-8 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800">
                    <strong>Current Shared Message:</strong> {sharedMessage}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">SimpleTextCompare</h3>
                  <p className="text-gray-600 mb-4">Simple text comparison tool with highlighting</p>
                  <button
                    onClick={() => handleAppSelect('costsense')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Launch App
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">TimestampLab</h3>
                  <p className="text-gray-600 mb-4">Timestamp manipulation and conversion tool</p>
                  <button
                    onClick={() => handleAppSelect('timestamplab')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Launch App
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
            <iframe
              style={{height:'100vh'}}
              ref={iframeRef}
              src={currentApp?.path}
              className="w-full h-full border-0"
              title={currentApp?.name}
            />
        )}
      </div>
   
  );
};

export default MasterApp;