# How the table dashboard is created on the teacher's end

- StudentName refers to the name of the student (it is retrieved from the list of student names tableNames and then identified by the index)
- SubmissionMenu refers to the button to allow the teacher to remove/ edit student information

```
sortStudentIndex().map((index, i) => {
    ...
})
```

- `index` represents the student index for each iteration, and `i` is the index of the iteration itself

- Inside the map function, `const sp = tableNames.filter((tn) => tn.studentIndex === index)[0];` filters the tableNames array to find the student with the matching studentIndex. This `sp` object contains the information for the current student, such as id, name, and score.

- In the fetched `tableNames`, it contains the fields

eg. `{studentUserID: 64, studentIndex: 5, score: 0, name: 'example student', id: 5}`

- In the fetched `submissions`, it contains the fields

eg. `{id: 23, image: null, text: 'example', stars: 4, comments: '', task: 3, student: 64}`

where id is the submission id, task is the task id, student tallies with the studentUserID (unique User id) in tableNames (from the `User` table)
