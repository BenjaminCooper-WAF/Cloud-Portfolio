console.log("GitHub projects JavaScript loaded");

const GITHUB_USERNAME = "BenjaminCooper-WAF";
const MAX_PROJECTS = 6;

const EXCLUDED_REPOSITORIES = [
  "BenjaminCooper-WAF",
];

// Leave empty to display all public, non-fork repositories.
const REQUIRED_TOPICS = [];

const projectsGrid = document.getElementById("projects-grid");
const loadingMessage = document.getElementById("projects-loading");
const errorMessage = document.getElementById("projects-error");

const languageIcons = {
  JavaScript: "fa-brands fa-js",
  TypeScript: "fa-solid fa-code",
  Python: "fa-brands fa-python",
  HCL: "fa-solid fa-cubes",
  HTML: "fa-brands fa-html5",
  CSS: "fa-brands fa-css3-alt",
  Shell: "fa-solid fa-terminal",
  Dockerfile: "fa-brands fa-docker",
};

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatRepositoryName(name) {
  return name
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(dateString) {
  if (!dateString) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function repositoryIsEligible(repository) {
  if (
    repository.fork ||
    repository.archived ||
    repository.disabled ||
    repository.private
  ) {
    return false;
  }

  if (EXCLUDED_REPOSITORIES.includes(repository.name)) {
    return false;
  }

  // Empty list means display all eligible repositories.
  if (REQUIRED_TOPICS.length === 0) {
    return true;
  }

  const repositoryTopics = repository.topics ?? [];

  return repositoryTopics.some((topic) =>
    REQUIRED_TOPICS.includes(topic.toLowerCase())
  );
}

function createTopicTags(repository) {
  const topics = repository.topics ?? [];

  if (topics.length > 0) {
    return topics
      .slice(0, 4)
      .map(
        (topic) =>
          `<span class="project-tag">${escapeHTML(topic)}</span>`
      )
      .join("");
  }

  if (repository.language) {
    return `
      <span class="project-tag">
        ${escapeHTML(repository.language)}
      </span>
    `;
  }

  return `<span class="project-tag">GitHub Project</span>`;
}

function createProjectCard(repository) {
  const title = formatRepositoryName(repository.name);

  const description =
    repository.description ||
    "Explore the source code, infrastructure configuration and project documentation on GitHub.";

  const language = repository.language || "Code";

  const languageIcon =
    languageIcons[repository.language] || "fa-solid fa-code";

  const liveProjectLink =
    repository.homepage && repository.homepage.trim() !== ""
      ? `
        <a
          href="${escapeHTML(repository.homepage)}"
          class="project-link project-link-secondary"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View live version of ${escapeHTML(title)}"
        >
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          Live Demo
        </a>
      `
      : "";

  return `
    <article class="github-project-card">
      <div class="project-card-top">
        <div class="project-icon" aria-hidden="true">
          <i class="fa-solid fa-folder-open"></i>
        </div>

        <span class="project-updated">
          Updated ${formatDate(repository.pushed_at)}
        </span>
      </div>

      <h3>${escapeHTML(title)}</h3>

      <p class="project-description">
        ${escapeHTML(description)}
      </p>

      <div class="project-tags">
        ${createTopicTags(repository)}
      </div>

      <div class="project-metadata">
        <span>
          <i class="${languageIcon}" aria-hidden="true"></i>
          ${escapeHTML(language)}
        </span>

        <span>
          <i class="fa-regular fa-star" aria-hidden="true"></i>
          ${repository.stargazers_count ?? 0}
        </span>

        <span>
          <i class="fa-solid fa-code-fork" aria-hidden="true"></i>
          ${repository.forks_count ?? 0}
        </span>
      </div>

      <div class="project-links">
        <a
          href="${escapeHTML(repository.html_url)}"
          class="project-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View ${escapeHTML(title)} source code on GitHub"
        >
          <i class="fa-brands fa-github"></i>
          Source Code
        </a>

        ${liveProjectLink}
      </div>
    </article>
  `;
}

async function fetchGitHubProjects() {
  const endpoint =
    `https://api.github.com/users/${encodeURIComponent(
      GITHUB_USERNAME
    )}/repos?sort=pushed&direction=desc&per_page=30&type=owner`;

  console.log("Loading repositories from:", endpoint);

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  console.log("GitHub response status:", response.status);

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with status ${response.status}`
    );
  }

  return response.json();
}

async function displayGitHubProjects() {
  if (!projectsGrid) {
    console.error(
      'GitHub integration error: Missing element with id="projects-grid".'
    );
    return;
  }

  try {
    if (loadingMessage) {
      loadingMessage.hidden = false;
    }

    if (errorMessage) {
      errorMessage.hidden = true;
    }

    const repositories = await fetchGitHubProjects();

    console.log("Repositories received:", repositories);

    const selectedRepositories = repositories
      .filter(repositoryIsEligible)
      .sort(
        (firstRepository, secondRepository) =>
          new Date(secondRepository.pushed_at) -
          new Date(firstRepository.pushed_at)
      )
      .slice(0, MAX_PROJECTS);

    console.log("Repositories selected:", selectedRepositories);

    if (selectedRepositories.length === 0) {
      projectsGrid.innerHTML = `
        <p class="projects-status">
          No matching public projects are currently available.
        </p>
      `;
      return;
    }

    projectsGrid.innerHTML = selectedRepositories
      .map(createProjectCard)
      .join("");
  } catch (error) {
    console.error("Unable to load GitHub repositories:", error);

    projectsGrid.innerHTML = `
      <p class="projects-status projects-error">
        Unable to load GitHub projects: ${escapeHTML(error.message)}
      </p>
    `;

    if (errorMessage) {
      errorMessage.hidden = false;
      errorMessage.textContent =
        `Unable to load projects: ${error.message}`;
    }
  } finally {
    if (loadingMessage) {
      loadingMessage.hidden = true;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    displayGitHubProjects
  );
} else {
  displayGitHubProjects();
}