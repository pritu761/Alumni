import DonationsList from "@/components/DonationsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
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
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Give Back to Your Alma Mater</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your contributions help us continue providing excellent education and opportunities for future generations
        </p>
      </div>

      {/* Current Campaigns */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {causes.map((cause, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  {cause.title}
                </CardTitle>
                <CardDescription>{cause.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Raised: ${cause.raised.toLocaleString()}</span>
                      <span>Goal: ${cause.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {Math.round((cause.raised / cause.goal) * 100)}% of goal reached
                    </div>
                  </div>
                  <Button className="w-full" asChild>
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Make a General Donation</h2>
          <p className="text-xl mb-6">
            Support our institution's overall mission and impact
          </p>
          <div className="flex justify-center space-x-4">
            {[25, 50, 100, 250].map((amount) => (
              <Button key={amount} variant="secondary" asChild>
                <Link href={`/donations/donate?amount=${amount}`}>
                  ${amount}
                </Link>
              </Button>
            ))}
            <Button className="text-black-500 bg-white-900">
              <Link href="/donations/donate">Custom Amount</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
        <DonationsList />
      </div>
    </div>
  );
}
