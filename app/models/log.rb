class Log < ActiveRecord::Base
  belongs_to :connection

  def create_log connection, data
    log = Log.create(data)
    connection.logs << log
    last_date = log
    connection.logs.each {|log| last_date = log if log.timestamp > last_date.timestamp}
    if (connection.category != 0 && connection.category != nil) && !last_date.nil?
      connection.health = ((Date.today - last_date.timestamp) / connection.category).to_f
    end
    connection
  end
end