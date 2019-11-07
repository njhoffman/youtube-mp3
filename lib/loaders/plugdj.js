const _ = require('lodash');
const columnify = require('columnify');

module.exports = ({ config, utils }, done) => {
  const { filePath } = config.data.plugDj;
  const { logger, loadFile } = utils;
  const songs = [];

  const sets = loadFile({ filePath });
  if (!sets || sets.length === 0) {
    return done(null);
  }

  sets.forEach(set => {
    // title, author, cid, duration, format, image
    set.data.forEach(song => {
      songs.push({
        name: `${song.author} - ${song.title}`,
        author: song.author,
        title: song.title,
        duration: song.duration,
        id: song.cid
      });
    });
  });

  const sorted = _.sortBy(songs, 'author');
  logger.info(`Loaded ${sorted.length} songs from ${filePath}`);
  logger.debug(columnify(sorted, { columns: ['id', 'author', 'title'] }));
  return done(null, sorted);
};
