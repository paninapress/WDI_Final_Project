class Log < ActiveRecord::Base
  belongs_to :connection

  def self.create_log connection, data
    log = Log.create(data)
    connection.logs << log
    last_date = connection.logs.order("timestamp DESC").first
    Connection.recalculate_health(connection)
    return connection
  end
end