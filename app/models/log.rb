class Log < ActiveRecord::Base
  belongs_to :connection

  def self.create_log (connection, data)
    connection.logs << Log.create(data)
    Connection.recalculate_health(connection)
    return connection
  end
end