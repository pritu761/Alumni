"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Heart } from "lucide-react";
import { authenticatedFetcher } from "@/lib/fetcher";

export default function DonationsList() {
  const { data: donations, error, isLoading } = useSWR('/api/donations', authenticatedFetcher);

  if (error) return <div className="text-center text-red-600">Error loading donations.</div>;
  if (isLoading) return <div className="text-center">Loading donations...</div>;

  return (
    <div className="space-y-4">
      {donations?.length > 0 ? (
        <div className="grid gap-4">
          {donations.map((donation: any) => (
            <Card key={donation.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{donation.user?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-600">
                        {donation.purpose || 'General Fund'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={12} className="mr-1" />
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-green-600">
                        ${donation.amount.toLocaleString()}
                      </span>
                      <Badge 
                        variant={
                          donation.status === 'COMPLETED' ? 'default' :
                          donation.status === 'PENDING' ? 'secondary' : 'destructive'
                        }
                      >
                        {donation.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600">
              Be the first to support your alma mater with a donation
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
