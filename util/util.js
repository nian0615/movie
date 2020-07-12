// 必须加function
// 定义星星组件的格式
function compile_stars(stars) {
  var arr = [];
  // 只取stars前面的一个数字
  // console.log(stars.toString().subString(0, 1), "hhh");
  var num = stars.toString().substring(0, 1);
  for (let i = 1; i <= 5; i++) {
    //    如果小于等于num
    if (i <= num) {
      arr.push(1);
    } else {
      arr.push(0);
    }
  }
  return arr;
}
// 获取电影信息的请求
function http(url, callback) {
  wx.request({
    url: url,
    method: "Get",
    header: {
      "content-type": "application/xml" // 默认值
    },
    success(res) {
      // console.log(res.data, "999");  获取到电影的信息豆瓣的所有信息
      // 然后需要处理一下这些信息
      callback(res.data);
    },
    fail(err) {
      console.log(err);
    }
  });
}
// 处理影人信息(上部分)
function moviePeople(casts) {
  var castsjoin = "";
  for (var inx in casts) {
    castsjoin = castsjoin + casts[inx].name + "/";
  }
  // console.log(castsjoin.length, 11);
  // console.log(castsjoin.substring(0, castsjoin.length - 1), 22);
  // 截取字符串 王念念/王果果/ ==> 王念念/王果果
  return castsjoin.substring(0, castsjoin.length - 2);
}
// 处理影人信息(下部分)
function moviePeopleInfo(casts) {
  var castsArry = [];
  for (var index in casts) {
    var cast = {
      // 判断是否有图片
      img: casts[index].avatars ? casts[index].avatars.large : "",
      name: casts[index].name
    };
    castsArry.push(cast);
  }
  return castsArry;
}
module.exports = {
  compile_stars: compile_stars,
  http: http,
  moviePeople: moviePeople,
  moviePeopleInfo: moviePeopleInfo
};
