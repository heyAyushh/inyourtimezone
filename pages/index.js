import timezones from "./timezones.json";
import React, { useState, useEffect } from "react";
// Time zones divided by Defined by UTC Offset
import { useRouter } from "next/router";
import { Box, Card, Text, Heading, Flex, Link, Button } from "rebass";
import { Label, Input, Radio } from "@rebass/forms";
import { route } from "next/dist/next-server/server/router";

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
  const [timeinput, setTime] = useState();
  const [zoneinput, setZone] = useState();

  const { time, zone } = router.query; // passed in query

  const handleClick = (e) => {
    e.preventDefault();
    if (timeinput && zoneinput) {
      router.push("/?time=" + timeinput + "&zone=" + zoneinput);
    } else {
      alert("Please enter Time " + timeinput + " and Zone " + zoneinput);
    }
  };

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
    } else if (requiredTimeInNumber && requiredTimeInNumber < 0) {
      requiredTimeInNumber += 24;
    }

    //Check if Morning, Afternoon,Evening, night
    // return Unslash image with url wrapped for styling
    function maenURL(number) {
      const preURL = "url(https://source.unsplash.com/1600x900/?";

      if (number > 20 || number < 5) {
        return preURL + "night)";
      } else if (number > 5 && number < 10) {
        return preURL + "morning)";
      } else if (number > 10 && number < 16) {
        return preURL + "afternoon)";
      } else if (number > 16 && number < 20) {
        return preURL + "evening)";
      } else {
        console.error("Time is not parseable");
        return null;
      }
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

    console.log(`Given Time and Zone is ${time} + ${zone} `);
    console.log(`Given time zone UTC is ${givenTimeZone.UTC} `);
    console.log(`Given time zone Area is ${givenTimeZone.areas} `);
    console.log(`Given time zone City is ${givenTimeZone.city} `);
    console.log(`Local Time zone UTC is ${localTimeZone.UTC}`);
    console.log(`Local Time zone Area is ${localTimeZone.areas}`);
    console.log(`Local Time zone City is ${localTimeZone.city}`);
    console.log(`Given Time zone in Number is ${givenTimeZoneinNumber}`);
    console.log(`Local Time zone in Number is ${LocalTimeZoneinNumber}`);
    console.log(
      `Difference is ${givenTimeZoneinNumber - LocalTimeZoneinNumber}`
    );

    return (
      <Flex>
        <Box
          height={"auto"}
          p={[4, 6]}
          sx={{
            backgroundImage: maenURL(requiredTimeInNumber),
            width: ["100%", "70%"],
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            borderRadius: 2,
            color: "white",
          }}
        >
          <Card my={[4, 0]}>
            <Heading color="primary" p={9}>
              In your Time:Zone
            </Heading>
            <Card
              my={5}
              sx={{
                ":hover": { backgroundColor: "muted" },
              }}
            >
              <Text m={2} fontSize={[40, 16]}>
                <br />
                Given time is {time} {zone}
                <br />
                <Text color="secondary" fontWeight="bold">
                  Local Time will be {requiredTimeInString} {localTimeZone.zone}{" "}
                  <br />
                </Text>
                <br />
              </Text>
            </Card>
          </Card>
        </Box>
        {screen.width < 700 ? null : (
          <Box width={["1/3", "20%"]} p={[4, 6]}>
            <Link
              sx={{
                display: "inline-block",
                fontWeight: "bold",
                px: 2,
                py: 1,
                color: "inherit",
                ":hover": {
                  color: "secondary",
                  textDecoration: "underline",
                  textDecorationColor: "primary",
                },
              }}
              href={"https://twitch.tv/c0d3spaghetti"}
            >
              Built on C0d3Spaghetti
            </Link>
          </Box>
        )}
      </Flex>
    );
  } else {
    return (
      <Flex>
        <Box p={3} width={[1, 1/2]} as="form">
          <Label htmlFor="date" sx={{fontWeight: 900}}>Time in 24 Hour Format</Label>
          <Input
            id="time"
            name="time"
            type="time"
            placeholder="hh:mm"
            onChange={(event) => setTime(event.target.value)}
          />
          <br />
          <Label htmlFor="date" sx={{fontWeight: 900}}>Select your time zone</Label>
          <Box p={2}>
            {timezones.map((timezone) => (
              <Box width={[1, 1 ]}>
                <Label>
                  <Radio
                    name="timezone"
                    id={timezone.zone}
                    key={timezone.zone}
                    value={timezone.zone}
                    onChange={(event) => setZone(event.target.value)}
                  />
                  {"UTC " +
                    timezone.UTC +
                    ", " +
                    timezone.zone +
                    ", " +
                    timezone.areas}
                </Label>
              </Box>
            ))}
          </Box>
          <Box px={2} ml="auto">
            <Button variant="primary" onClick={handleClick}>
              Submit
            </Button>
          </Box>
        </Box>
      </Flex>
    );
  }
}
