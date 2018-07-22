const Boom = require('boom');
const Expense = require('../models/Expense');

const getExpenses = async () => {
  const users = await Expense.find();
  if (!users.length) {
    throw Boom.notFound('No expenses found');
  }
  return users;
};

const addExpense = async (req) => {
  const { title, description, amount, date } = req.payload;
  try {
    const expense = await Expense.create({ title, description, amount, date });
    return expense;
  } catch (error) {
    throw Boom.internal('Internal server error');
  }
};

// const getCompanies = (req, reply) => {
//   return new Promise((resolve, reject) => {
//     Company.find({}, (err, companies) => {
//         if (err) {
//             reply(err).code(404);
//         }
//         return resolve(reply.response(companies));
//     })
//   });
// }

// const getCompany = (req, reply) => {
//   return new Promise((resolve, reject) => {
//     if (!req.params.id) {
//         return resolve(reply({err: 'id is required param'}).code(400));
//     }

//     Company.findById(req.params.id, (err, company) => {
//         if (err) {
//             return reply(err).code(404);
//         }
//         return resolve(reply.response(company));
//     });
//   });
// }

// const updateCompany = (req, reply) => {
//   return new Promise((resolve, reject) => {
//     if (!req.params.id) {
//       return reply({ err: 'id is required param' }).code(400);
//     }
//     let attributes = {};

//     if (req.payload.name) {
//         attributes.name = req.payload.name;
//     }
//     if (req.payload.city) {
//         attributes.city = req.payload.city;
//     }
//     if (req.payload.address) {
//         attributes.address = req.payload.address;
//     }

//     Company.findByIdAndUpdate(
//           req.params.id,
//           attributes,
//           {new: true},
//           (err, company) => {
//         if (err) {
//             return resolve(reply(err).code(500));
//         }
//         return resolve(reply.response(company));
//     })

//   });
// }

// const deleteCompany = (req, reply) => {
//   return new Promise((resolve, reject) => {
//     Company.findByIdAndRemove(req.params.id, (err, result) => {
//       if (err) {
//           return resolve(reply(err).code(500));
//       }
//       if (result) {
//         return resolve(reply.response({msg: `company ${result.name} deleted`}));
//       }
//       return resolve(reply.response({ msg: 'Already deleted' }));
//     })
//   })
// }

module.exports = {
  addExpense,
  getExpenses,
};
