class Log < ActiveRecord::Base
  belongs_to :connection

  def self.create_log connection, data
    log = Log.create(data)
    connection.logs << log
    last_date = connection.logs.order("timestamp DESC").first
    binding.pry
    if (connection.category != 0 && connection.category != nil) && !last_date.nil?
      connection.health = ((Date.today - last_date.timestamp) / connection.category).to_f
    end
    binding.pry
    return connection
  end
end