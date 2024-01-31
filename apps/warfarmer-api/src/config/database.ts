import { secrets } from 'docker-secret';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: secrets.WF_DB_URL ?? process.env.DATABASE_URL,
  },
});
