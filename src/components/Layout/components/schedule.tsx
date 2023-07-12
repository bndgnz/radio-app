import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

import createContext from 'react';

const SCHEDULE = gql`
  query GetSchedule($id: String!) {
    schedule(id: $id) {
      title
      showTodayOnly
      mondayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          slug
          playlistUrl
          showUrl
          path
          cimage  
          introduction
          
        }
      }
      tuesdayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          slug
          playlistUrl
          showUrl
          path
          cimage 
          introduction
         
        }
      }
      wednesdayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          slug
          playlistUrl
          showUrl
          path
          cimage 
          introduction
          
        }
      }
      thursdayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          playlistUrl
          showUrl
          slug
          path
          cimage
          introduction 
        
        }
      }
      fridayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          introduction
          playlistUrl
          showUrl
          slug
          path
          cimage 
          
        }
      }
      saturdayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          introduction
          playlistUrl
          showUrl
          slug
          path
          cimage 
          
        }
      }
      sundayCollection(limit: 10) {
        items {
          timeSlotsCollection(limit: 3) {
            items {
              title
              day
              startTime
              endTime
              amPm
            }
          }
          title
          introduction
          playlistUrl
          showUrl
          slug
          path
          cimage 
          
        }
      }
    }
  }
`;

function Schedule(props) {


  const id = props.id;

  const { data, loading, error } = useQuery(SCHEDULE, { variables: { id } });
  if (loading) {
    return <div> </div>;
  }
  if (error) {
    return <div> </div>;
  }
 
  var day = null;


  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var p = new Date();
  var dayName = weekday[p.getDay()];
  const dayOfWeekDigit = new Date().getDay();
  const mode = data.schedule.showTodayOnly;
  var componentTitle;
  if (data.schedule.showTodayOnly != true) {
    componentTitle = data.schedule.title;
  } else {
    componentTitle = "Today on Waiheke Radio";
  }

  function Dates(props) {
    const listOfItems = props.slot[0].items.map((time, idx) => {
      var first3;
      if (data.schedule.showTodayOnly != true) {
        first3 = time.day.slice(0, 3);
      } else {
        first3 = "";
      }

      return (
        <time
          key={idx}
          className={
            dayName.slice(0, 3).toLowerCase() == first3.toLowerCase() ||
            data.schedule.showTodayOnly == true
              ? "show"
              : "show"
          }
        >
          <style jsx>{`
            .hide {
              display: none;
            }
            .show {
              display: block;
            }
          `}</style>{" "}
          {first3} {time.startTime}-{time.endTime} {time.amPm.toLowerCase()}
        </time>
      );
    });

    return <div className="time-slots"> {listOfItems} </div>;
  }
  /////////////////////////////////////////////////////////////////////////////
  function Audio(props) {
    if (props.url) {
 

      return (
        <>
<span className="latest-show">Latest Show</span>

        <div className="default-audio-controls">
          <audio controls src={props.url}>
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </div>
        </>
      );
    } else {
      return null;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////

  function Showcard(props) {
    switch (props.showDay) {
      case "sunday":
        day = data.schedule.sundayCollection.items;
        break;
      case "monday":
        day = data.schedule.mondayCollection.items;
        break;
      case "tuesday":
        day = data.schedule.tuesdayCollection.items;
        break;
      case "wednesday":
        day = data.schedule.wednesdayCollection.items;
        break;
      case "thursday":
        day = data.schedule.thursdayCollection.items;
        break;
      case "friday":
        day = data.schedule.fridayCollection.items;
        break;
      case "saturday":
        day = data.schedule.saturdayCollection.items;
        break;
    }

    const listOfItems = day.map((show, idx) => (
      <div className="row amazon-playlist-row showlist" key={idx}>

      <div className="col-lg-2 col-xs-12 amazon-podcast-image">
        <a href={"../show/" + show.slug}>
          {" "}
          <img src={show.cimage[0].url} alt="..." />
        </a>
         
      </div>

      <div className="col-lg-2 col-xs-12 amazon-podcast-content">
        
          <strong>
            <a href={"../show/" + show.slug}>{show.title}</a>
          </strong> 
     </div>
        <div className="col-lg-4 col-xs-12 amazon-podcast-content">
          {show.introduction} 
        </div>
    
      <div className="col-lg-2 col-xs-12">
      <Dates slot={[show.timeSlotsCollection]} show={show.title} />
        
      </div>
      <div className="col-lg-2 col-xs-12">
      <Audio
                url=  {show.showUrl}
                title={"PLAY MOST RECENT SHOW FOR " + show.title}
              />
        
      </div>
    </div>
    ));

    return (
   
        <div className="container">
       
         
            {listOfItems}{" "}
         
        </div>
   
    );
  }

  if (data.schedule.showTodayOnly != true) {
    return (
      <div className="container page-block">
      <section className="blog-area ptb-100 schedule ">
        

        <h3>{data.schedule.title} </h3>
          <Tabs defaultIndex={dayOfWeekDigit} className=" ">
            <TabList>
              <Tab>Sunday</Tab>
              <Tab>Monday</Tab>
              <Tab>Tuesday</Tab>
              <Tab>Wednesday</Tab>
              <Tab>Thursday</Tab>
              <Tab>Friday</Tab>
              <Tab>Saturday</Tab>
            </TabList>

            <TabPanel>
              <Showcard showDay="sunday" />
            </TabPanel>
            <TabPanel>
              <Showcard showDay="monday" />
            </TabPanel>
            <TabPanel>
              <Showcard showDay="tuesday" />
            </TabPanel>
            <TabPanel>
              <Showcard showDay="wednesday" />
            </TabPanel>
            <TabPanel>
              <Showcard showDay="thursday" />
            </TabPanel>
            <TabPanel>
              <Showcard showDay="friday" />
            </TabPanel>
            <TabPanel>
              <Showcard showDay="saturday" />
            </TabPanel>
          </Tabs>
     
      </section>
      </div>
    );
  } else
    return (
      <div className="coming-up-today">
  
        <Showcard showDay="{dayName.toLowerCase()}" />
      </div>
    );
}

export default Schedule;
