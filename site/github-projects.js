"use strict";

const GITHUB_USERNAME = "BenjaminCooper-WAF";
const MAX_PROJECTS = 6;

// Add repository names here if you do not want them displayed.
const EXCLUDED_REPOSITORIES = [
  "BenjaminCooper-WAF",
];

// Only repositories containing at least one of these topics will be shown.
// Leave the array empty to display all eligible repositories.
const REQUIRED_TOPICS = [
  "aws",
  "cloud",
  "devops",
  "terraform",
  "docker",
  "kubernetes",
  "python",
  "automation",
  "portfolio",
];

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
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function repositoryIsEligible(repository) {
  if (repository.fork || repository.archived || repository.disabled) {
    return false;
  }

  if (EXCLUDED_REPOSITORIES.includes(repository.name)) {
    return false;
  }

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

  const liveProjectLink = repository.homepage
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
          ${repository.stargazers_count}
        </span>

        <span>
          <i class="fa-solid fa-code-fork" aria-hidden="true"></i>
          ${repository.forks_count}
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

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with status ${response.status}`
    );
  }

  return response.json();
}

async function displayGitHubProjects() {
  try {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;

    const repositories = await fetchGitHubProjects();

    const selectedRepositories = repositories
      .filter(repositoryIsEligible)
      .sort(
        (firstRepository, secondRepository) =>
          new Date(secondRepository.pushed_at) -
          new Date(firstRepository.pushed_at)
      )
      .slice(0, MAX_PROJECTS);

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

    projectsGrid.innerHTML = "";
    errorMessage.hidden = false;
  } finally {
    loadingMessage.hidden = true;
  }
}

document.addEventListener("DOMContentLoaded", displayGitHubProjects);