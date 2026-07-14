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

function createProjectCard(repository, index) {
  const title = formatRepositoryName(repository.name);

  const description =
    repository.description ||
    "Explore the source code, infrastructure configuration and project documentation.";

  const topics = repository.topics ?? [];

  const tags =
    topics.length > 0
      ? topics
          .slice(0, 4)
          .map((topic) => `<span>${escapeHTML(topic)}</span>`)
          .join("")
      : `<span>${escapeHTML(repository.language || "GitHub")}</span>`;

  const label = (
    [
      repository.language,
      ...topics.slice(0, 2),
    ]
      .filter(Boolean)
      .join(" • ") || "GITHUB PROJECT"
  ).toUpperCase();

  const demoButton =
    repository.homepage && repository.homepage.trim() !== ""
      ? `
        <a
          href="${escapeHTML(repository.homepage)}"
          target="_blank"
          rel="noopener noreferrer"
          class="project-link secondary"
        >
          Live Demo
        </a>
      `
      : "";

  return `
    <article class="project-card">

      <div class="project-number">
        ${String(index + 1).padStart(2, "0")}
      </div>

      <p class="project-label">
        ${escapeHTML(label)}
      </p>

      <h3>${escapeHTML(title)}</h3>

      <p>${escapeHTML(description)}</p>

      <div class="project-tags">
        ${tags}
      </div>

      <div class="project-links">

        <a
          href="${escapeHTML(repository.html_url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="project-link"
        >
          <i class="fa-brands fa-github"></i>
          Source Code
        </a>

        ${demoButton}

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
  .map((repo, index) => createProjectCard(repo, index))
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