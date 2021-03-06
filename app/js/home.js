import API from "./API.js";
import { API_ENDPOINT, counting, makeNewComment } from "./api.js";

console.log(
  "The current user is",
  API.whichUser.person,
  "with user id: ",
  API.whichUserId.id,
  "The clicked comment id is :",
  API.clickedCommentId.comid
);

const title = document.querySelector(".title > h2");
const at = document.querySelector(".at > div > p");
const tweetContainer = document.querySelector(".tweet-container");

const selectedImg = document.querySelector(".fileContainer");
selectedImg.addEventListener("change", (e) => {
  let choice = e.target.files[0];
  const sImg = document.querySelector(".userimg");
  sImg.src = URL.createObjectURL(choice);
});


const callTweets = async () => await API.getTweets()
  .then(data => createTweets(data))


const createTweets = (tweetData) => {
  for (let i in tweetData) {
    if (tweetData[i].user.name === API.whichUser.person) {
      title.innerText = `${API.whichUser.person}`;
      at.innerText = `@${API.whichUser.person}`;
    }
    const text = document.createElement("div");
    text.className = `comment-box`;
    text.id = `${tweetData[i].id}`;
    text.innerHTML = `
        <a href=""><div class="header">
          <h5 class="userName">${tweetData[i].user.name}</h5>
          <h5>${tweetData[i].date}</h5>
        </div></a>
        <div class="content">
          <p>
          ${tweetData[i].content}
          </p>
          <p class="hash"></p>
        </div>
        <div class="footer">
          <div class="cont">
            <img src="./img/heart 1.png" class="heart" alt="heart">
            <p>${tweetData[i].likes}</p>
          </div>
          <div class="cont">
            <img src="./img/retweetgrey.png" class="retweet" alt="share symbol">
            <p>${tweetData[i].retweets}</p>
          </div>
          <div class="cont">
            <button class="msgs"><img src="./img/comment.png" alt="message boxes"></button>
            <p>${tweetData[i].comments.length}</p>
          </div>
        </div>`;
    tweetContainer.append(text);
  }
  userClicks()
  likeBtns()
  retweetBtn()
  commentBoxes()
}

const userClicks = () => {
  const users = document.querySelectorAll(".header");
  users.forEach((u, i) =>
    u.addEventListener("click", () => {
      console.log("hi")
      API.clickedCommentId.removeItem("comid");
      API.clickedCommentId.setItem("comid", i + 1);
      u.parentNode.href = "mypage.html";
    })
  );
}

const likeBtns = () => {
  const likes = document.querySelectorAll(".heart");
  const once = { once: true };
  likes.forEach((like) =>
    like.addEventListener(
      "click",
      (e) => {
        const parentId = e.path[3].id;
        const addLike =
          parseInt(like.parentElement.querySelector("p").innerText) + 1;
        counting({ likes: addLike }, `${API_ENDPOINT}/tweets/${parentId}`);
        like.parentElement.querySelector("p").innerText = addLike;
        e.target.src = "./img/icon.png";
      },
      once
    )
  );
}

const retweetBtn = () => {
  const retweets = document.querySelectorAll(".retweet");
  const once = { once: true };
  retweets.forEach((tweet) =>
    tweet.addEventListener(
      "click",
      (e) => {
        const parentId = e.path[3].id;
        const addRetweet =
          parseInt(tweet.parentElement.querySelector("p").innerText) + 1;
        counting(
          { retweets: addRetweet },
          `${API_ENDPOINT}/tweets/${parentId}`
        );
        tweet.parentElement.querySelector("p").innerText = addRetweet;
        e.target.src = "./img/retweet.png";
      },
      once
    )
  );
}

const commentBoxes = () => {
  const coms = document.querySelectorAll(".msgs");
  coms.forEach((item, i) => {
    item.addEventListener("click", (e) => {
      API.clickedCommentId.removeItem("comid");
      API.clickedCommentId.setItem("comid", i + 1);

      const comBox = document.createElement("div");
      comBox.className = "text";
      comBox.innerHTML = `
        <textarea name="comment" class="commentText" placeholder="Your comment" rows="5"></textarea>
        <div>
          <img src="./img/Arrow 1.png" alt="arrow" class="arrow"></img>
          <button class="reply">Reply</button>
        </div>`;
      e.target.offsetParent.append(comBox);

      item.disabled = true;

      const arrow = comBox.querySelector(".arrow");
      arrow.addEventListener("click", () => {
        comBox.remove(comBox);
        item.disabled = false;
      });

      const reply = comBox.querySelector(".reply");
      reply.addEventListener("click", (e) => {
        const textcont = comBox.querySelector(".commentText");
        if (textcont.value === "") {
          window.alert("Please enter a comment!");
        } else {
          makeNewComment(`${textcont.value}`);
          const pselect = item.parentNode.querySelector("p");
          pselect.innerText = parseInt(pselect.innerText) + 1;
          comBox.remove(comBox);
          item.disabled = false;
        }
      });
    });
  });
}

callTweets()