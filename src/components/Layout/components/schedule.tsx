import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

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
          image {
            url
            width
            height
          }
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
          image {
            url
            width
            height
          }
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
          image {
            url
            width
            height
          }
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
          image {
            url
            width
            height
          }
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
          playlistUrl
          showUrl
          slug
          path
          image {
            url
            width
            height
          }
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
          playlistUrl
          showUrl
          slug
          path
          image {
            url
            width
            height
          }
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
          playlistUrl
          showUrl
          slug
          path
          image {
            url
            width
            height
          }
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
              : "hide"
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
      <div className=" col-lg-2 carousel-cell" key={idx}>
        <div className="single-blog-post">
          <div className="post-image">
            <div className="event-image">
              <div
                className="event-title"
                style={{
                  backgroundImage: "url(" + `${show.image.url}` + ")",
                  width: "100%",
                  height: 200,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <Link
                  href={`/shows/${show.slug}`}
                  title={"Find out more about " + show.title}
                >
                  <a title={"Find out more about " + show.title}><h2> {show.title}</h2> </a>
                </Link>
                <Dates slot={[show.timeSlotsCollection]} show={show.title} />
              </div>
            
              <Audio
                url=  {show.showUrl}
                title={"PLAY MOST RECENT SHOW FOR " + show.title}
              />
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <section className="blog-area ptb-100">
        <div className="container">
       
          <div className="row carousel" data-flickity='{ "autoPlay": true }'>
            {listOfItems}{" "}
          </div>{" "}
        </div>
      </section>
    );
  }

  if (data.schedule.showTodayOnly != true) {
    return (
      <section className="blog-area ptb-100">
        <div className="container">

        <h3>{data.schedule.title} </h3>
          <Tabs defaultIndex={dayOfWeekDigit}>
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
        </div>
      </section>
    );
  } else
    return (
      <div className="coming-up-today">
  
        <Showcard showDay={dayName.toLowerCase()} />
      </div>
    );
}

export default Schedule;
