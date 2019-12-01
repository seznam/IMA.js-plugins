/**
 * Command is an abstract class that defines a standard for defining command.
 *
 * @interface
 */
export default class Command {
  /**
   * Start executing defined command. In the end a {@code Promise} is returned
   * with a resulting value. On the returned {@code Promise} a {@code catch}
   * method can be called to prevent any unwanted interruption.
   *
   * @param {...any} args Arguments to be passed when executing jobs
   * @returns {Promise}
   */
  execute() {}
}
