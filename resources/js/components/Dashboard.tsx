import { TrendingUp, Users, Globe, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { 
      label: 'Total Visitors', 
      value: '24,563', 
      change: '+12.5%', 
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    { 
      label: 'Active Websites', 
      value: '12', 
      change: '+2', 
      trend: 'up',
      icon: Globe,
      color: 'green'
    },
    { 
      label: 'Total Pages', 
      value: '148', 
      change: '+8', 
      trend: 'up',
      icon: FileText,
      color: 'purple'
    },
    { 
      label: 'Conversion Rate', 
      value: '3.24%', 
      change: '-0.4%', 
      trend: 'down',
      icon: TrendingUp,
      color: 'orange'
    },
  ];

  const recentActivity = [
    { action: 'New page published', site: 'Marketing Site', time: '2 minutes ago' },
    { action: 'User registered', site: 'E-commerce Store', time: '15 minutes ago' },
    { action: 'Content updated', site: 'Blog', time: '1 hour ago' },
    { action: 'Settings changed', site: 'Portfolio', time: '3 hours ago' },
    { action: 'New comment', site: 'Marketing Site', time: '5 hours ago' },
  ];

  const topPages = [
    { page: '/products/new-arrival', views: 4521, bounce: '32%' },
    { page: '/blog/web-design-trends', views: 3847, bounce: '28%' },
    { page: '/about', views: 2918, bounce: '45%' },
    { page: '/contact', views: 1652, bounce: '52%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your websites.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600',
          };
          
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.site}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <span className="text-sm font-semibold text-gray-900">{page.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${100 - parseInt(page.bounce)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{page.bounce} bounce</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
