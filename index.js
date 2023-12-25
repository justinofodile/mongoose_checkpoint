//import neccessary packages
const mongoose = require('mongoose')
const express = require('express');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 3000;

//Connecting to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//Creating a person schema
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    favoriteFoods: { type: [String] }
});

//Creating a person model based on the schema
const Person = mongoose.model('Person', personSchema)


//Creating a person model
const newPerson = new Person({
    name: 'Justin Ofodile',
    age: 30,
    favoriteFoods: ['Rice', 'Burgar']
});

newPerson.save()
    .then(data => {
        console.log('Person saved:', data);
    })
    .catch(err => {
        console.error('Error saving person:', err);
    });

//Creating Many Records with model.create()
const arrayOfPeople = [
    {
        name: 'Chioma', age: 10, favoriteFoods: ['Pepper Soup', 'Chicken Salad']
    },
    {
        name: 'Okoro', age: 40, favoriteFoods: ['Soup', 'Akpu']
    }
]

Person.create(arrayOfPeople).then(data => {
    console.log('People saved:', data);
}).catch(err => {
    console.error('Error saving people:', err);
});

// Use model.find() to Search Your Database
Person.find({ name: 'Chioma' }).then(data => {
    console.log('Person with name Chioma: ', data)
}).catch(err => {
    console.log(err)
})

// Use model.findOne() to Return a Single Matching Document
Person.findOne({ favoriteFoods: 'Akpu' }).then(data => {
    console.log('Person with favorite food Pizza:', data)
}).catch(err => {
    console.log(err)
})

// Use model.findById() to Search Your Database By _id
const personId = '6589b51eff9cd0516c791a04';
Person.findById(personId).then(data => {
    console.log('Person with id ' + personId + ':', data);
}).catch(err => {
    console.log(err)
})

// Perform Classic Updates by Running Find, Edit, then Save
Person.findById(personId).then(person => {
    person.favoriteFoods.push('Hamburger');
    person.save().then(data => {
        console.log('Person updated with Hamburger:', data);
    }).catch(err => {
        console.log(err)
    })
}).catch(err => {
    console.log(err)
})

// Perform New Updates on a Document Using model.findOneAndUpdate()
const personName = 'Okoro';
Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true },).then(data => {
        console.log(personName + ' updated to age 20:', data);
    }).catch(err => {
        console.log(err)
    })

// Delete One Document Using model.findByIdAndRemove. findByIdAndREmove() method is nolonger in use and thats what we are using findOneAndDelete() method
Person.findOneAndDelete({ _id: personId })
    .then(data => {
        if (!data) {
            console.log('Person not found for deletion');
        } else {
            console.log('Person removed by id ' + personId + ':', data);
        }
    })
    .catch(err => {
        console.error('Error deleting person:', err);
    });

// MongoDB and Mongoose - Delete Many Documents with model.remove(). We are using deleteMany() method because remove is deplecated
const removeName = 'Chioma';
Person.deleteMany({ name: removeName })
    .then(data => {
        console.log('People with name Chioma removed:', data);
    })
    .catch(err => {
        console.error('Error deleting people with name Chioma:', err);
    });

// Chain Search Query Helpers to Narrow Search Results
Person.find({ favoriteFoods: 'Pepper Soup' })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec().then(data => {
        console.log('People who like Pepper Soup:', data);
    }).catch(err => {
        console.log(err)
    })

app.listen(PORT, () => console.log(`Server started on ${PORT}`))