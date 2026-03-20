const Joi = require("joi");

const validatePatch = (req, res, next) => {
    const schema = Joi.object({
        completed : Joi.boolean().required()
    });

    const {error} = schema.validate(req.body);

    if(error){
        return res.status(400).json({error: error.details[0].message});
    }

    next();
};

module.exports = validatePatch;