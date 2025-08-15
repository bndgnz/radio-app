import { ShowInfo } from '../types/radioShow';

export const islandLifeShow: ShowInfo = {
  title: "Latest show",
  schedule: "Sat 10 - 12pm",
  duration: "1:59:39",
  about: "Island Life is broadcast live every Saturday from 10am - 12pm Island Life is brought to you by The Humble Pie Village Butchery, the place to go for fine cuts of meat and friendly service, 102 Ocean View Road, Oneroa.",
  sponsor: "Proudly sponsored by: Humble Pie Village Butchery",
  presenters: [
    {
      id: "1",
      name: "Chris Walker",
      role: "Presenter",
      description: "Long time island resident, Waiheke Community Radio trustee, Host of Island Life & Counting The Beat.",
      avatar: "https://i.pravatar.cc/150?img=33"
    },
    {
      id: "2",
      name: "Greg Treadwell",
      role: "Presenter", 
      description: "Greg Treadwell has been as a reporter, photographer and newspaper editor - and here on Waiheke Radio he a DJ",
      avatar: "https://i.pravatar.cc/150?img=51"
    }
  ],
  audioUrl: "/audio/sample-show.mp3" // Replace with actual audio URL
};