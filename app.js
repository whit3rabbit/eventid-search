import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const EventSearch = () => {
  const [events, setEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('windows_eventids.json');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const filtered = Object.entries(events).reduce((acc, [id, event]) => {
      const searchString = `${id} ${event.summary} ${event.description} ${event.category} ${event.subcategory}`.toLowerCase();
      if (searchString.includes(searchTerm.toLowerCase())) {
        acc[id] = event;
      }
      return acc;
    }, {});
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const SecurityImpactBadge = ({ impact }) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[impact] || 'bg-gray-100 text-gray-800'}`}>
        {impact}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Windows Event ID Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Event ID, summary, or description..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(filteredEvents).map(([id, event]) => (
          <Card key={id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Event ID: {id}</CardTitle>
                <SecurityImpactBadge impact={event.llm_security_impact} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p>{event.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Category</h3>
                    <p>{event.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Subcategory</h3>
                    <p>{event.subcategory}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p>{event.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technical Analysis</h3>
                  <p>{event.llm_technical_description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Typical Volume</h3>
                    <p>{event.llm_typical_volume}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Recommended Monitoring</h3>
                    <p>{event.llm_recommended_monitoring}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Type</h3>
                    <p>{event.type}</p>
                  </div>
                </div>

                {event.event_xml && (
                  <div>
                    <h3 className="font-semibold mb-2">Event XML</h3>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <code>{event.event_xml}</code>
                    </pre>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Supported Operating Systems</h3>
                  <p>{event.operating_systems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventSearch;
