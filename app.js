const searchInput = document.getElementById("search-input");
const infoTab = document.getElementById("info-tab");
const repoHead = document.getElementById("repo-head");
const repoTab = document.getElementById("repo-tab");
const infoMessage = document.getElementById("info-message");
const spinner = document.getElementById("spinner");
const errmsgNotFound = "User not found. Enter a valid GitHub username to begin.";
const errmsgInvalidData = "Invalid data returned from GitHub API.";
const errmsgFailtoFetch = "Failed to fetch user\'s repositories.";
// const githubToken = process.env.GITHUB_TOKEN;

// 검색 input에서 Enter 키 입력 시 이벤트 핸들러 등록
searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    const username = searchInput.value.trim();
    spinner.style.display = "block";
    infoTab.style.display = "none";
    repoHead.style.display = "none";
    repoTab.style.display = "none";
    infoMessage.style.display = "none";
    // GitHub API를 사용하여 사용자 정보 가져오기 (비동기 통신)
    fetch(`https://api.github.com/users/${username}`, {
      headers: {
        // Authorization: `token ${githubToken}`,
        // Authorization: 'token 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',
      },
    })
      .then((response) => {
        if (!response.ok) {
          // 사용자를 찾지 못한 경우
          throw new Error(errmsgNotFound);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          infoTab.innerHTML = `
        <div id="info-tab" class="tab">
        <div id="info-profile">
          <img src="${data.avatar_url}" id="profile-img"/>
          <button id="view-profile-button" onclick="redirectToGitHubProfile()">View Profile</button>
        </div>
        <div id="info-description">
          <div id="info-cards">
            <div id="info-card">
              <p id="public-repos">Public Repos: ${data.public_repos}</p>
              <p id="public-gists">Public Gists: ${data.public_gists}</p>
              <p id="followers">Followers: ${data.followers}</p>
              <p id="following">Following: ${data.following}</p>
              <p id="username">${data.login}</p>
            </div>
            <div id="username">
              <p>@${data.login}</p>
            </div>
          </div>
          <div id="info-table">
            <table>
              <tr>
                <td id="company">Company: ${data.company || "N/A"}</td>
              </tr>
              <tr>
                <td id="website">Website/Blog: <a href="${data.blog
            }" target="_blank">${data.blog || "N/A"}</a></td>
              </tr>
              <tr>
                <td id="location">Location: ${data.location || "N/A"}</td>
              </tr>
              <tr>
                <td id="memberSince">Member Since: ${new Date(
              data.created_at
            ).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
        </div>
        </div>
        `;
        }
        else {
          spinner.style.display = "none";
          throw new Error("Invalid data returned from GitHub API.");
        }
        fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            // Authorization: 'token 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',
          },
        })
          .then((response) => {
            if (!response.ok) {
              displayErrorMsg(errmsgNotFound);
              throw new Error("Failed to fetch user's repositories");
            }
            return response.json();
          })
          .then((repos) => {
            repoTab.innerHTML = "";
            repos.forEach((repo) => {
              repoTab.innerHTML += `
                <div id="repo-tab" class="tab">
                  <div id="repo-section">
                    <div id="repo-name">
                      <p ><a href="https://github.com/${username}/${repo.name}">${repo.name}</a></p>
                    </div>
                    <div id="repo-cards">
                      <p id="stars">Stars: ${repo.stargazers_count}</p>
                      <p id="watchers">Watchers: ${repo.watchers_count}</p>
                      <p id="forks">Forks: ${repo.forks_count}</p>
                    </div>
                  </div>
                </div>
        `;
              infoTab.style.display = "block";
              repoHead.style.display = "block";
              repoTab.style.display = "block";
              spinner.style.display = "none";
            });
          })
          .catch((error) => {
            console.error(error);
            displayErrorMsg(errmsgFailtoFetch);
          });
      }
      ).catch((error) => {
        console.error(error);
        if (error.message === errmsgNotFound) {
          displayErrorMsg(errmsgNotFound);
        } else {
          displayErrorMsg(errmsgInvalidData);
        }
      });
  }
});

function redirectToGitHubProfile() {
  const username = searchInput.value.trim();
  if (username) {
    const githubProfileUrl = `https://github.com/${username}`;
    window.location.href = githubProfileUrl;
  }
}

function displayErrorMsg(msg) {
  spinner.style.display = "none";
  infoMessage.innerHTML =
    `<div id="info-message"><p>${msg}</p></div>`;
  infoMessage.style.display = "block";
}