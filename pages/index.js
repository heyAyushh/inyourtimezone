import timezones from "./timezones.json";
// Time zones divided by Defined by UTC Offset
import { useRouter } from "next/router";

// Check if a 24 Hour Clock time given is valid
function checkTime(time) {
  const isTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (time && isTime.test(time)) {
    return true;
  } else {
    return false;
  }
}

export default function Index() {
  const router = useRouter();
  const { time, zone } = router.query; // passed in query

  // zone exists and the time is in correct format
  // JSX
  if (
    timezones.filter((timezone) => timezone.zone === zone)[0] &&
    checkTime(String(time))
  ) {
    const givenTimeZone = timezones.filter(
      (timezone) => timezone.zone === zone
    )[0]; // the first one

    const d = new Date(); // based on my local time;
    const localTimeZoneUTC = d.getTimezoneOffset(); // This is in Number

    // Detect local time zone UTC
    const LocaltimeZoneinString =
      Math.floor(Number(localTimeZoneUTC / -60)) +
      ":" +
      String(
        Number(localTimeZoneUTC / -60) -
          Math.floor(Number(localTimeZoneUTC / -60))
      ) *
        60;

    // filter them with our JSON
    const localTimeZone = timezones.filter(
      (timezone) => timezone.UTC == LocaltimeZoneinString
    )[0];

    // UTC difference
    // Destination is givenTimeZone.UTC into Number
    // Local is localTimeZone.UTC
    // Difference will be givenTimeZone.UTC - localTimeZone.UTC

    const givenTimeZoneinNumber =
      Number(String(givenTimeZone.UTC).split(":")[0]) +
      Number(
        String(givenTimeZone.UTC).split(":")[1]
          ? Number(String(givenTimeZone.UTC).split(":")[1])
          : 0
      ) /
        60;

    var givenTimeinNumber =
      Number(String(time).split(":")[0]) +
      Number(
        String(time).split(":")[1] ? Number(String(time).split(":")[1]) / 60 : 0
      );

    givenTimeinNumber = Number(givenTimeinNumber.toFixed(1));

    const LocalTimeZoneinNumber = Number(localTimeZoneUTC / -60);

    // add given time and UTC Time difference

    var requiredTimeInNumber = Number(
      givenTimeinNumber - (givenTimeZoneinNumber - LocalTimeZoneinNumber)
    );

    if (requiredTimeInNumber && requiredTimeInNumber > 24) {
      requiredTimeInNumber -= 24;
    }

    // Cast it in String then

    const requiredTimeInString =
      String(Math.floor(requiredTimeInNumber)) +
      ":" +
      String(
        Math.round(
          (requiredTimeInNumber - Math.floor(requiredTimeInNumber)) * 60
        )
      );

    return (
      <div>
        Given Time and Zone is {time} + {zone} <br />
        Given time zone UTC is {givenTimeZone.UTC} <br />
        Given time zone Area is {givenTimeZone.areas} <br />
        Given time zone City is {givenTimeZone.city} <br />
        <br />
        <br />
        Local Time zone UTC is {localTimeZone.UTC}
        <br />
        Local Time zone Area is {localTimeZone.areas} <br />
        Local Time zone City is {localTimeZone.city} <br />
        <br />
        <br />
        Given Time zone in Number is {givenTimeZoneinNumber} <br />
        Local Time zone in Number is {LocalTimeZoneinNumber} <br />
        Difference is {givenTimeZoneinNumber - LocalTimeZoneinNumber} <br />
        <br />
        Given time in Local Time will be {requiredTimeInString}
      </div>
    );
  } else {
    return <div>Zone does not exist Or time could not be parsed</div>;
  }
}
