export const configuration = () => {
     return {
        ENV : process.env.NODE_ENV,
        PORT : process.env.PORT,
        DBURI : process.env.DBURI,
        DATABASE : process.env.DATABASE,
        OPT_VALIDATION_LENGTH : process.env.OPT_VALIDATION_LENGTH,
        COOKIE_SECRET : process.env.COOKIE_SECRET,
        TTL:process.env.TTL,
        RATE_LIMIT : process.env.RATE_LIMIT,
        SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        SCHEDULE_DATE_LIMIT: process.env.SCHEDULE_DATE_LIMIT
     }
}


  