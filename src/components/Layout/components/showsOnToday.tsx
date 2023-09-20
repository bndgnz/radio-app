import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";

function Schedule(props: any) {


  const SCHEDULE = gql`
    query GetSchedule($id: String!) {
      schedule(id: $id) {
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

    fragment collectionItems on Shows {
      djCollection(limit: 3) {
        items {
          title
        }
      }
      timeSlotsCollection(limit: 7) {
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
      introduction
      cimage
    }
  `;

  const id = "2pzI1DF16MRjM6tWUyutAI";

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

  function Dates(props) {
    const listOfItems = props.slot[0].items.map((time, idx) => {
      var first3;

      first3 = time.day.slice(0, 3);

      return (
        <span
          key={idx}
          className={
            dayName.slice(0, 3).toLowerCase() == first3.toLowerCase() ||
            data.schedule.showTodayOnly == true
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
          {time.startTime} - {time.endTime} {time.amPm.toLowerCase()}
        </span>
      );
    });

    return <div className=" "> {listOfItems} </div>;
  }

  function djList(collection) {
    const listOfItems = collection.map((name, index) => (
      <li key={index}>{name}</li>
    ));

    return { listOfItems };
  }

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
      <div className="on-today-item" key={idx}>
        <div
          className="on-today-event-title"
          style={{
            backgroundImage: "url(" + `${show.cimage[0].url}` + ")",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="container ">
            <div className="row">
              <div className="col-8   col-xs-12">
                <Link
                  href={`/shows/${show.slug}`}
                  title={"Find out more about " + show.title}
                >
                  <a
                    className="tooltiplink"
                    data-title={
                      show.title +
                      "\n" +
                      "Presented by " +
                      "\n" +
                      show.djCollection.items.map((a) => {
                        const djList = a.title + " ";
                        return djList;
                      }) +
                      "\n - " +
                      show.introduction
                    }
                    data-html="true"
                  >
                    {show.title}{" "}
                  </a>
                </Link>
              </div>
              <div className="col-4 col-xs-12">
                {" "}
                <Dates slot={[show.timeSlotsCollection]} show={show.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="container">
        <div>{listOfItems}</div>
      </div>
    );
  }

  return (
    <div className="today-collection ">
      <h6>Playing on {dayName}</h6>
      <Showcard showDay={dayName.toLowerCase()} />
    </div>
  );
}

export default Schedule;
