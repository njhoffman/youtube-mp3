const _ = require('lodash');
const columnify = require('columnify');

module.exports = ({ config, utils }, done) => {
  const { logger, loadFile } = utils;
  const songs = [];

  const sets = loadFile(config.data.plugDj);
  if (!sets || sets.length === 0) {
    return done(null);
  }

  sets.forEach(set => {
    // title, author, cid, duration, format, image
    set.data.forEach(song => {
      songs.push({
        author: song.author,
        title: song.title,
        duration: song.duration,
        cid: song.cid
      });
    });
  });

  const sorted = _.sortBy(songs, 'author');
  logger.debug(columnify(sorted));
  return done(null, sorted);
};
