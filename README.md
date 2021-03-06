# meet-halfway Website

This project builds website for people, who want to find a location for meeting geographically distributed people.

When trying to bring together people from different locations, there is always a question where to meet.
<br>Travel distances might differ significantly and, as a result, the organisers might feel obliged to accommodate some people at expense of others.

This website is designed to help by calculating [centroid](https://en.wikipedia.org/wiki/Centroid).
<br>In context of maps, centroid is the geographical average location for provided coordinates.

## Website URL

The project has been published to GitHub pages and can be accessed [here](https://koleaby4.github.io/meet-halfway).

## Customers' profile and needs

Our typical customer is a socially active person 15+ years old
who is planning to organise a meeting with family members, friends, colleagues of business counterparts.

The customer would have names and addresses of the meeting participants and would want to be able to:

1. add / remove participants
2. see their names and location on the maps
3. see central location (centroid) as soon as 2 or more participants are added
4. access formatted address of the central location (so it could be easily shared)
5. explore nearby places on the map around the central location
6. restore previously confirmed participants in case browsing session was interrupted

Depending on circumstances, our customers want to be able to comfortably use the website from both desktop and mobile devices.

## User Stories

All user stories have been tracked using GitHub's [issues section](https://github.com/koleaby4/meet-halfway/issues?utf8=%E2%9C%93&q=is%3Aissue).
GitHub Issues is a lightweight equivalent of [Jira](https://www.atlassian.com/software/jira), <br>
which is widely used for planning and tracking software development activities.

By default all tickets represent functional user stories. <br>
Example of a user story: [Navbar on the top](https://github.com/koleaby4/meet-halfway/issues/18)

Tickets with ['bug' label](https://github.com/koleaby4/meet-halfway/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Abug+),
represent defects in code, which have been found during testing.

Additional ['Non-functional' labels](https://github.com/koleaby4/meet-halfway/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3ANon-functional+)
have been introduced to help categorising and filtering tasks.

## Wireframes

Wireframes have been implemented using [balsamiq](https://balsamiq.com) and attached to respective user stories.
<br>In this way developers would know exactly what they should implement, which picking up respective stories.

Examples:

- [Display Google maps [mobile]](https://github.com/koleaby4/meet-halfway/issues/5)
- [Form for adding participants](https://github.com/koleaby4/meet-halfway/issues/4)

## Font and colour choices

Because core functionality of the application is relying on interaction with google maps it was needed to allocate a major part of the screen space for map rendering. Keeping in mind that Google maps utilise a wide range of colours, our designs had to be neutral and non-distracting.
As a result, the following conventional colours were chosen:

- dark grey for background
- green for confirmation and addition buttons
- red for deletion and conveying error messages

It was decided to use Roboto Google font because its pure geometric forms and friendly curves result in clear and and functional visuals.

## Why search of nearby places has been removed?

One of the initial implementations allowed users to search for nearby places within 500m from central pin.
Users were able to specify whether they wanted to see hotels, restaurants or pubs
and respective locations were shown with their native icons, names and Google ratings.

Although that functionality appeared to be useful at the design stage, it did not work well when implemented
because Google Maps are showing all places by default and our custom icons were overlapping with already rendered on the map places.

As a result, it was decided to remove custom search and marking of nearby places, allowing customers to work with native Google Maps functionality.
This resulted in cleaner and more familiar customer experience.

## How we tested it

Functional tests have been carried out manually on regular basis.
Special attention was paid to cross-browser and cross-platform compatibility by using:

- Physical devices
  1. Windows10 & Chrome (desktop)
  2. Windows10 & IE11 (desktop)
  3. Google Pixel 2 & Chrome (mobile)
- Virtual devices: Apple iPhone X via [SauceLabs](https://saucelabs.com)

Both positive and error flows were tested. <br>
User-friendly error messages were implemented to be shown to the customers when:

- Addresses were not entered by the user or were not found by Google Maps API
- Service requests failed for technical reasons.

Automated tests using [cypress](https://www.cypress.io) have been added to landing and services sections.
We also created a task to [add more automated tests](https://github.com/koleaby4/meet-halfway/issues/28) in the future.

Two accessibility scanners were used to validate website:

- [aXe](https://www.deque.com/axe)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)

Finally, a series of peer reviews helped identifying additional issues such as:

- A number of orthographic mistakes
- Gaps in documentation
- Compatibility issues ([Issue 26](https://github.com/koleaby4/meet-halfway/issues/26))

### Known issues

All known defects have been captured as GitHub issues and [marked by 'bug' label](https://github.com/koleaby4/meet-halfway/labels/bug).
<br>As part of the project work we've addressed some of the issues found in testing.
<br>We continue investigation of the remaining open issues such as [Website does not work in Edge and IE11](https://github.com/koleaby4/meet-halfway/issues/26).
That issue was caused by the use of ES6 features like [Classes](https://caniuse.com/#feat=es6-class) and [Arrow Functions](https://caniuse.com/#feat=arrow-functions), which are currently not fully supported by IE11.
We expect that usage of [Babel](https://babeljs.io/) should be able to resolve that compatibility issue. Not resolved yet due to configuration complexity - still work in progress.

## How to run cypress tests

Prerequisites:

1.  Clone project's source codes
2.  Make sure you have [npm installed](https://www.npmjs.com/get-npm)

To execute tests:

1.  In terminal navigate to project folder
2.  Run `npm install`
3.  Run
    1. `npm run cypress:run` to execute all tests in headless mode
    2. or `npm run cypress:open` to open cypress UI and cherry-pick which tests to run

## How website was published

Website had been published into GitHub pages by following instructions provided in<br>
[Configuring a publishing source for GitHub Pages](https://help.github.com/en/articles/configuring-a-publishing-source-for-github-pages).

The instructions are very clear and trying to re-write them in my own words: 1. Won't make them any better 2. Will violate [KISS principles](https://en.wikipedia.org/wiki/KISS_principle)

## How to open it locally

1. Navigate to project repository: `https://github.com/koleaby4/meet-halfway`
2. Follow [GitHub cloning instructions](https://help.github.com/en/articles/cloning-a-repository) to download or clone source files
3. Navigate to the project folder and open `config.js` file. Replace apiKey with your own Google Maps API key
   <br>(Google maps services are not free, so key provided with this project's source codes have been restricted to only with for specific domains)
4. Navigate to the project folder and open `index.html` in your web browser

## Validations

1. HTML validations:
   - [User story](https://github.com/koleaby4/meet-halfway/issues/15)
   - [Full report](https://validator.w3.org/nu/?doc=https%3A%2F%2Fkoleaby4.github.io%2Fmeet-halfway%2F)
2. CSS validations:
   - [User story](https://github.com/koleaby4/meet-halfway/issues/16)
   - [Full report](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fkoleaby4.github.io%2Fmeet-halfway%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)
     please note that existing failures are from 3rd party libraries.

## Tools and technologies used

1.  IDE: [Visual Studio Code](https://code.visualstudio.com/)
2.  Web technologies:
    - [HTML](https://en.wikipedia.org/wiki/HTML5)
    - [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#CSS_3)
    - [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
    - [jQuery](https://en.wikipedia.org/wiki/JQuery)
3.  Styling libraries and components:
    - [normalize.css](https://necolas.github.io/normalize.css)
    - [Bootstrap](https://getbootstrap.com)
    - [Bootswatch](https://bootswatch.com)
    - [Google fonts](https://fonts.google.com)
    - [Ion Icons](https://ionicons.com)
    - [Sweet Alerts](https://sweetalert2.github.io)
4.  Source code versioning:
    - [Git](https://en.wikipedia.org/wiki/Git)
    - [GitHub](https://github.com)
5.  Validators:
    - [HTML validator](https://validator.w3.org/)
    - [CSS validator](http://jigsaw.w3.org/css-validator/)
6.  Testing tools:
    - [Chrome Dev Tools](https://developers.google.com/web/tools/chrome-devtools)
    - [aXe accessibility scanner](https://www.deque.com/axe)
    - [SauceLabs](https://saucelabs.com) for cross-platform & cross-browser compatibility
7.  Wireframes: [balsamiq](https://balsamiq.com)
8.  Favicon generator: [favicon.io](https://favicon.io/favicon-generator)

## External resources / credits

1. Images: [Unsplash](https://unsplash.com)
2. [Google Maps API documentation](https://developers.google.com/maps/documentation/javascript)

## Code snippets

1. [Shake pattern](https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_image_shake)

## Acknowledgements

Special thank you to the people who guided and supported me during planning, execution and testing of this project:

- Anna Greaves
- Mario Aslau
- Sergio Rosas
- Natalie Marleny
- Simen Daehlin (mentor)

## Disclaimer

This project was created for educational purposes only.
