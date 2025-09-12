import DonationsList from "@/components/DonationsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, DollarSign, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DonationsPage() {
  const causes = [
    {
      title: "Scholarship Fund",
      description: "Support deserving students with financial assistance",
      raised: 45000,
      goal: 100000
    },
    {
      title: "Infrastructure Development",
      description: "Help improve campus facilities and technology",
      raised: 75000,
      goal: 150000
    },
    {
      title: "Research Programs",
      description: "Fund cutting-edge research initiatives",
      raised: 30000,
      goal: 80000
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Give Back to Your Alma Mater
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Your contributions help us continue providing excellent education and opportunities for future generations.
            Every donation, big or small, makes a significant impact.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/donations/donate" className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" /> Donate Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-300">
              <Link href="/donations/create" className="flex items-center">
                <Plus className="h-5 w-5 mr-2" /> Start a Campaign
              </Link>
            </Button>
          </div>
        </div>

        {/* Current Campaigns */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Current Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causes.map((cause, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-white">
                    <Heart className="h-6 w-6 text-red-500 mr-3" />
                    {cause.title}
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">{cause.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        <span>Raised: <span className="font-bold">${cause.raised.toLocaleString()}</span></span>
                        <span>Goal: <span className="font-bold">${cause.goal.toLocaleString()}</span></span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" 
                          style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
                        <span className="font-semibold">{Math.round((cause.raised / cause.goal) * 100)}%</span> of goal reached
                      </div>
                    </div>
                    <Button className="w-full text-lg py-6" asChild>
                      <Link href={`/donations/donate?cause=${encodeURIComponent(cause.title)}`}>
                        Donate Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Donate */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl p-10 mb-16 shadow-lg">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Make a General Donation</h2>
            <p className="text-xl mb-8 opacity-90">
              Support our institution's overall mission and impact with a quick contribution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[25, 50, 100, 250, 500].map((amount) => (
                <Button key={amount} variant="secondary" size="lg" className="text-lg px-6 py-3" asChild>
                  <Link href={`/donations/donate?amount=${amount}`}>
                    ${amount}
                  </Link>
                </Button>
              ))}
              <Button variant="outline" size="lg" className="text-lg px-6 py-3 bg-white text-blue-700 hover:bg-gray-100" asChild>
                <Link href="/donations/donate">Custom Amount</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Recent Donations</h2>
          <DonationsList />
        </div>
      </div>
    </div>
  );
}
