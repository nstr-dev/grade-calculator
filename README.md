![Banner](https://github.com/noahstreller/grade-calculator/blob/main/public/feature-banner.png?raw=true)

# Grade Calculator - nstr.dev

![Status](https://status.cloud.nstr.dev/api/badge/1/status)
![Status](https://status.cloud.nstr.dev/api/badge/1/uptime/48)

## Quick links

- ✨ [Grade Calculator](https://grades.nstr.dev)
- 🕰️ [Legacy version](https://legacy.grades.nstr.dev)
- 📋 [Backlog and issues](https://links.nstr.dev/projects-grades)
- ✅ [Status page](https://status.cloud.nstr.dev/status/grades)
- ⚖️ [Privacy policy](http://grades.nstr.dev/privacy)
- 🍪 [Cookie policy](https://grades.nstr.dev/cookies)
- 🔌 [Selfhosting](https://links.nstr.dev/projects-grades?page=selfhosting)

This is a grade calculator / dashboard that I built to have a better overview of my current academic performance. I was tired of always having to calculate the grade required to pass a subject. And to be honest, the grade dashboard of my school kinda sucks. The UI is horrible, and it doesn't show enough information for my needs. That's why I developed my own dashboard.

## Key Features

- Modern design thanks to shadcn/ui components and Tailwind magic
- Customizable numeric grade scale
- Visualizing your grades using graphs and charts
- View the grades you need to pass a subject at a glance
- Supports grade weights
- Mark subjects as irrelevant for academic promotion
- See the subjects you struggle in summarized
- Option to wipe account data from the database
- Cloud synced for easy access anywhere
- Log in using your service (currently `Discord`, `Google`, `GitHub`) or with a magic link sent to your email
- Desktop first, but the mobile interface works well thanks to responsive design
- [Legacy version](https://legacy.grades.nstr.dev/) available for usage without account and cloud (unmaintained)
- Exporting and importing your grades made easy
- Categories to organize your subjects (useful if you attend multiple schools or want to separate your subjects)
- Self-hosting possible

## Screenshots

The screenshots below use following grading system:

| Best grade | Worst grade | Grade required to pass |
| ---------- | ----------- | ---------------------- |
| 100        | 0           | 60                     |

You can change these values according to your needs inside the grade calculators settings.

_Note: only numeric grading scales are supported at the moment. You can use percentages instead, if you use a letter grading scale. I will try to add this feature soon._

---

![Dark Screenshot](https://github.com/noahstreller/grade-calculator/blob/main/public/screenshot-dark.png?raw=true)

![Light Screenshot](https://github.com/noahstreller/grade-calculator/blob/main/public/screenshot-light.png?raw=true)

## Selfhosting

This web-app can be selfhosted using Docker. Check out the guide [here](https://links.nstr.dev/projects-grades?page=selfhosting).
