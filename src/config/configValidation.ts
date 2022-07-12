import * as Joi from "joi";

export const configValidation = Joi.object({
    NODE_ENV : Joi.string().valid("dev", "prod").required(),
    PORT : Joi.number().positive().default(5000),
    DBURI : Joi.string(),
    DATABASE : Joi.string(),
    OPT_VALIDATION_LENGTH : Joi.string().default(4),
    COOKIE_SECRET : Joi.string(),
    TTL : Joi.number().default(10),
    RATE_LIMIT : Joi.number().default(60),
    SUPER_ADMIN_PASSWORD: Joi.string().default("admin@admin.com"),
    SUPER_ADMIN_USERNAME: Joi.string().default("admin@123"),
    SCHEDULE_DATE_LIMIT: Joi.string().default("3")
})