import { useCrmStore } from '../store/useCrmStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Analytics() {
  const { deals } = useCrmStore();

  const totalWon = deals.filter(d => d.stage === 'Won').reduce((acc, curr) => acc + curr.value, 0);
  const totalLost = deals.filter(d => d.stage === 'Lost').reduce((acc, curr) => acc + curr.value, 0);
  
  const acquisitionData = [
    { month: 'Jan', organic: 4000, referrals: 2400 },
    { month: 'Feb', organic: 3000, referrals: 1398 },
    { month: 'Mar', organic: 2000, referrals: 9800 },
    { month: 'Apr', organic: 2780, referrals: 3908 },
    { month: 'May', organic: 1890, referrals: 4800 },
    { month: 'Jun', organic: 2390, referrals: 3800 },
  ];

  const sourceData = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Referral', value: 300 },
    { name: 'Organic', value: 200 },
  ];
  
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2, 173 58% 39%))', 'hsl(var(--chart-3, 197 37% 24%))', 'hsl(var(--chart-4, 43 74% 66%))'];

  const conversionData = [
    { name: 'Won', value: deals.filter(d => d.stage === 'Won').length },
    { name: 'Lost', value: deals.filter(d => d.stage === 'Lost').length },
    { name: 'Active', value: deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your performance metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acquisitionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="organic" name="Organic Search" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="referrals" name="Referrals" stroke="hsl(var(--chart-2, 173 58% 39%))" strokeWidth={2} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deal Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
               <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Won Value</div>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-500">${totalWon.toLocaleString()}</div>
               </div>
               
               <div className="h-[250px] w-full max-w-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={conversionData}
                       cx="50%"
                       cy="50%"
                       outerRadius={100}
                       dataKey="value"
                       label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                       labelLine={false}
                       stroke="hsl(var(--background))"
                       strokeWidth={2}
                     >
                        <Cell fill="hsl(142 71% 45%)" /> {/* Won */}
                        <Cell fill="hsl(0 84% 60%)" /> {/* Lost */}
                        <Cell fill="hsl(var(--muted))" /> {/* Active */}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               </div>

               <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Lost Value</div>
                  <div className="text-4xl font-bold text-destructive">${totalLost.toLocaleString()}</div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
