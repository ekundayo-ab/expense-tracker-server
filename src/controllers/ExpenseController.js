import Boom from 'boom';
import Expense from '../models/Expense';

const getExpenses = async () => {
  const users = await Expense.find().select('-__v');
  return users;
};

const addExpense = async (req) => {
  const { title, description, amount, date } = req.payload;
  try {
    const expense = await Expense.create({ title, description, amount, date });
    return expense;
  } catch (error) {
    if (error.name === 'ValidationError') throw Boom.badRequest(error);
    throw Boom.internal(error);
  }
};

const getExpense = async (req) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);
  if (!expense) {
    throw Boom.notFound('Not found');
  }
  return expense;
};

const updateExpense = async (req) => {
  const { id } = req.params;
  let attributes = {};

  const allowedAttributes = ['title', 'description', 'date', 'amount'];

  if (req.payload) {
    attributes = Object.keys(req.payload)
      .filter(key => allowedAttributes.includes(key))
      .reduce((obj, key) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = req.payload[key];
        return obj;
      }, {});
  }

  try {
    const updatedExpense = await Expense
      .findByIdAndUpdate(id, attributes, { new: true })
      .select('-__v');
    return updatedExpense;
  } catch (error) {
    throw Boom.internal(error);
  }
};

const deleteExpense = async (req) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndRemove(id)
      .select('-__v');
    if (deletedExpense) {
      return { message: `${deletedExpense.title} deleted`, expense: deletedExpense };
    }
    return Boom.notFound('Not found');
  } catch (error) {
    throw Boom.internal(error);
  }
};

export {
  addExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense
};
