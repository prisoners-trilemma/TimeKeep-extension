try {
  let sTime, fTime, lists, added;
  const date = new Date(),
    url = location.href.split("://")[1],
    today =
      String(date.getFullYear()) +
      String(date.getMonth()) +
      String(date.getDate());
  chrome.storage.local.get(
    ["sTime", "fTime", "lists", "added", "isTimeOn"],
    (value) => {
      if (value) {
        sTime = value.sTime;
        fTime = value.fTime;
        lists = value.lists;
        added = value.added;
        isTimeOn = value.isTimeOn;
        if (
          isTimeOn &&
          lists.whiteList.every((e) => {
            return !url.startsWith(e);
          })
        ) {
          const domain = url.split("/")[0];
          if (
            added[today] &&
            Object.keys(added[today]).some((e) => {
              return domain.startsWith(e);
            })
          ) {
            const end = new Date(added[today][domain][0]).setMinutes(
              new Date(added[today][domain][0]).getMinutes() +
                Number(added[today][domain][1])
            );
            if (end - date <= 0) {
              timeOver(lists, sTime, fTime, date, url);
            } else {
              limit(end, () => {
                timeOver(lists, sTime, fTime, date, url);
              });
            }
          } else {
            timeOver(lists, sTime, fTime, date, url);
          }
        }
      } else {
        location.reload();
      }
    }
  );
} catch (e) {
  alert(e);
}
function timeOver(lists, sTime, fTime, date, url) {
  if (
    lists.blackList.some((e) => {
      return url.startsWith(e);
    }) ||
    (sTime.hours < fTime.hours &&
      ((sTime.hours == date.getHours() && sTime.minutes <= date.getMinutes()) ||
        (sTime.hours < date.getHours() && date.getHours() < fTime.hours) ||
        (fTime.hours == date.getHours() &&
          date.getMinutes() <= fTime.minutes))) ||
    (sTime.hours == fTime.hours &&
      sTime.hours == date.getHours() &&
      sTime.minutes <= date.getMinutes() &&
      date.getMinutes() <= fTime.minutes) ||
    (sTime.hours > fTime.hours &&
      ((sTime.hours == date.getHours() && sTime.minutes <= date.getMinutes()) ||
        (sTime.hours < date.getHours() && date.getHours() - 24 < fTime.hours) ||
        (sTime.hours < date.getHours() + 24 && date.getHours() < fTime.hours) ||
        (fTime.hours == date.getHours() && date.getMinutes() <= fTime.minutes)))
  ) {
    document.body = document.createElement("body");
    console.log("a");
  } else {
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      sTime.hours < date.getHours() ||
      (sTime.hours == date.getHours() && sTime.minutes < date.getMinutes())
        ? date.getDate() + 1
        : date.getDate(),
      sTime.hours,
      sTime.minutes
    );
    limit(start, () => {
      document.body = document.createElement("body");
    });
    console.log("b");
  }
}
function limit(start, callback) {
  let timeKeep = setInterval(() => {
    const nowDate = new Date();
    if (start - nowDate <= 0) {
      callback();
      clearInterval(timeKeep);
    }
  }, 1000);
}
