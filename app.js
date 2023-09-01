const searchInput = document.getElementById('search-input');
const infoTab = document.getElementById('info-tab');
const repoHead = document.getElementById('repo-head');
const repoTab = document.getElementById('repo-tab');
const infoMessage = document.getElementById('info-message');


// 검색 input에서 Enter 키 입력 시 이벤트 핸들러 등록
searchInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    const username = searchInput.value.trim();

    // GitHub API를 사용하여 사용자 정보 가져오기 (비동기 통신)
    fetch(`https://api.github.com/users/${username}`)
    .then(response => {
      if (!response.ok) {
        // 사용자를 찾지 못한 경우
        infoMessage.innerHTML = '<p>User not found. Enter a valid GitHub username to begin.</p>';
        infoTab.style.display = 'none';
        repoHead.style.display = 'none';
        repoTab.style.display = 'none';
        infoMessage.style.display = 'block';
        return null;
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        // 사용자를 찾은 경우
        // 사용자 정보를 DOM에 추가
        infoTab.innerHTML = `
        <div id="info-tab" class="tab">
        <div id="info-profile">
          <img src="${data.avatar_url}" id="profile-img"/>
          <button id="view-profile-button" onclick="redirectToGitHubProfile()">View Profile</button>
        </div>
        <div id="info-description">
          <div id="info-cards">
            <p id="public-repos">Public Repos: ${data.public_repos}</p>
            <p id="public-gists">Public Gists: ${data.public_gists}</p>
            <p id="followers">Followers: ${data.followers}</p>
            <p id="following">Following: ${data.following}</p>
          </div>
          <div id="info-table">
            <table>
              <tr>
                <td id="company">Company: ${data.company || 'N/A'}</td>
              </tr>
              <tr>
                <td id="website">Website/Blog: <a href="${data.blog}" target="_blank">${data.blog || 'N/A'}</a></td>
              </tr>
              <tr>
                <td id="location">Location: ${data.location || 'N/A'}</td>
              </tr>
              <tr>
                <td id="memberSince">Member Since: ${new Date(data.created_at).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
        </div>
        </div>
        `;

        // info-tab과 repo-head, repo-tab을 보이도록 변경
        infoTab.style.display = 'block';
        repoHead.style.display = 'block';
        repoTab.style.display = 'block';
        infoMessage.style.display = 'none';
      }
    })
    .catch(error => {
      console.error(error);
      infoMessage.innerHTML = '<p>An error occurred. Please try again later.</p>';
      infoMessage.style.display = 'block';
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