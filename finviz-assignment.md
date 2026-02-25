# Finviz  
## Assignment – Engineering – Full Stack

In this task, we will be ingesting, modeling, storing, and displaying data.

---

## Get Data

[ImageNet](https://image-net.org/) is a commonly used dataset in machine learning research. We'll be using its taxonomy system.

<img width="244" height="431" alt="Screenshot 2026-01-07 at 11 02 54" src="https://gist.github.com/user-attachments/assets/f65a5c47-e4d6-442d-a4ae-287444731e24" />

Download the data from:  
https://github.com/tzutalin/ImageNet_Utils/blob/master/detection_eval_tools/structure_released.xml

Your job is to parse the XML and transform it into a **linear form**, like this:

```ts
[
  { name: 'ImageNet 2011 Fall Release', size: 60941 },
  { name: 'ImageNet 2011 Fall Release > plant, flora, plant life', size: 4699 },
  {
    name:
      'ImageNet 2011 Fall Release > plant, flora, plant life > phytoplankton',
    size: 2
  },
  {
    name:
      'ImageNet 2011 Fall Release > plant, flora, plant life > phytoplankton > planktonic algae',
    size: 0
  },
  {
    name:
      'ImageNet 2011 Fall Release > plant, flora, plant life > phytoplankton > diatom',
    size: 0
  },
  {
    name:
      'ImageNet 2011 Fall Release > plant, flora, plant life > microflora',
    size: 0
  }
  // ...
]
```

We’ll use `>` as a separator for categories and subcategories.

---

## Store Data

Create a database (use any database system you like) to store these tuples `(string, number)` and fill it with the data you obtained in the first step.

---

## Make Sense of Data

Next, we’ll convert the linear data back into a tree structure, like this:

```ts
{
  name: 'ImageNet 2011 Fall Release',
  size: 60941,
  children: [
    {
      name: 'plant, flora, plant life',
      size: 4699,
      children: [
        {
          name: 'phytoplankton',
          size: 2,
          children: [
            /* ... */
          ]
        }
        // ...
      ]
    }
    // ...
  ]
}
```

### Tasks

- Write an algorithm that will output such a tree. You have to read this data in a linear form from the database.
- Describe the complexity of your algorithm in Big O notation.

---

## Show Data

### Tasks

- Design and build an interface to show this data. Choose yourself what you would like to highlight in the data and how to show it.
- Don’t load the whole dataset at once on the frontend
- Implement search in this UI
- Create a **README** explaining your main design decisions, what you focused on most, what you are most proud of, and the key trade-offs you considered.


---

## Tech Stack

We use React and TypeScript for frontend.

We use C# and TypeScript for backend most of the time.

We use Docker for local dev stack.

Otherwise, use any library you find the most suitable.

However, we’d like to see you at your best. If you prefer to use something else, please let us know.

---

## Assignment Submission

Create a git bundle file with the whole repository including commit history and send it over to us via email as attachment or link for download.

Bonus points: Create a life deployment of your application and send us the URL.
