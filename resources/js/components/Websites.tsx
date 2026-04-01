import { Globe, ExternalLink, Settings, Plus, Activity } from 'lucide-react';

export function Websites() {
  const websites = [
    {
      id: 1,
      name: 'Marketing Site',
      url: 'marketing.example.com',
      status: 'Active',
      visitors: 12500,
      uptime: '99.9%',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      url: 'store.example.com',
      status: 'Active',
      visitors: 8900,
      uptime: '99.8%',
      lastUpdated: '5 hours ago'
    },
    {
      id: 3,
      name: 'Blog',
      url: 'blog.example.com',
      status: 'Active',
      visitors: 5400,
      uptime: '100%',
      lastUpdated: '1 day ago'
    },
    {
      id: 4,
      name: 'Portfolio',
      url: 'portfolio.example.com',
      status: 'Maintenance',
      visitors: 2100,
      uptime: '95.2%',
      lastUpdated: '3 days ago'
    },
  ];

  const handleViewAnalytics = (site: any) => {
    alert(`Viewing analytics for ${site.name}:\n\nVisitors: ${site.visitors}\nUptime: ${site.uptime}\nStatus: ${site.status}`);
  };

  const handleViewSettings = (site: any) => {
    alert(`Opening settings for ${site.name}`);
  };

  const handleAddWebsite = () => {
    alert('Add Website feature - Create new website monitoring');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Websites</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all your websites.</p>
        </div>
        <button 
          onClick={handleAddWebsite}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Website
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {websites.map((site) => (
          <div key={site.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                  <a 
                    href={`https://${site.url}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                site.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {site.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Visitors</p>
                <p className="text-lg font-semibold text-gray-900">{site.visitors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Uptime</p>
                <p className="text-lg font-semibold text-gray-900">{site.uptime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Updated</p>
                <p className="text-sm text-gray-900">{site.lastUpdated}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => handleViewAnalytics(site)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Activity className="w-4 h-4" />
                Analytics
              </button>
              <button 
                onClick={() => handleViewSettings(site)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}