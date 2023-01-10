import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

const SCHEDULE = gql`
  query GetSchedule($id: String!) {
    showsOnToday(id: $id) {
      title
      schedule {
        title
        mondayCollection {
          items {
            ...collectionItems
          }
        }
        tuesdayCollection {
          items {
            ...collectionItems
          }
        }
        wednesdayCollection {
          items {
            ...collectionItems
          }
        }
        thursdayCollection {
          items {
            ...collectionItems
          }
        }
        fridayCollection {
          items {
            ...collectionItems
          }
        }
        saturdayCollection {
          items {
            ...collectionItems
          }
        }
        sundayCollection {
          items {
            ...collectionItems
          }
        }
      }
    }
  }
  fragment collectionItems on Shows {
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

  console.log(data);

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

  function Dates(props) {
    const listOfItems = props.slot[0].items.map((time, idx) => {
      var first3;
 
        first3 = time.day.slice(0, 3);
      

      return (
        <span
          key={idx}
          className={
            dayName.slice(0, 3).toLowerCase() == first3.toLowerCase() ||
            data.showsOnToday.schedule.showTodayOnly == true
              ? "show on-today-time"
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
       {time.startTime}-{time.endTime} {time.amPm.toLowerCase()}
        </span>
      );
    });

    return <div className=" "> {listOfItems} </div>;
  }
  /////////////////////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////

  function Showcard(props) {
    switch (props.showDay) {
      case "sunday":
        day = data.showsOnToday.schedule.sundayCollection.items;
        break;
      case "monday":
        day = data.showsOnToday.schedule.mondayCollection.items;
        break;
      case "tuesday":
        day = data.showsOnToday.schedule.tuesdayCollection.items;
        break;
      case "wednesday":
        day = data.showsOnToday.schedule.wednesdayCollection.items;
        break;
      case "thursday":
        day = data.showsOnToday.schedule.thursdayCollection.items;
        break;
      case "friday":
        day = data.showsOnToday.schedule.fridayCollection.items;
        break;
      case "saturday":
        day = data.showsOnToday.schedule.saturdayCollection.items;
        break;
    }

    const listOfItems = day.map((show, idx) => (
      <div className="on-today-item" key={idx}>
        <div
          className="on-today-event-title"
          style={{
            backgroundImage: "url(" + `${show.image.url}` + ")",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="container ">
            <div className="row">
              <div className="col-7 col-xs-12">
                {" "}
                <Link
                  href={`/shows/${show.slug}`}
                  title={"Find out more about " + show.title}
                >
                  <a title={"Find out more about " + show.title}>
                    {show.title} {" "}
                  </a>
                </Link>
               
              </div>
    <div className="col-5 col-xs-12"> <Dates slot={[show.timeSlotsCollection]} show={show.title} /></div>

            </div>
          </div>

         
        </div>
      </div>
    ));

    return (
      <section className=" ">
        <div className="container">
          <div>{listOfItems}</div>
        </div>
      </section>
    );
  }

  return (
    <div className="today-collection ">
      <h6>Coming up today</h6>
      <Showcard showDay={dayName.toLowerCase()} />
    </div>
  );
}

export default Schedule;
