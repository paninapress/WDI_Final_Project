class Log < ActiveRecord::Base
  belongs_to :connection

  def self.create_log (connection, data)
    connection.logs << Log.create(data)
    find_recent_log(connection)
    return connection
  end

  def self.find_recent_log(connection)
  	if connection.logs.count > 0
		connection.update_attributes(recent_log: connection.logs.order("timestamp DESC").first.timestamp)
		Connection.calculate_health(connection)
	else
		connection.update_attributes(recent_log: nil, health: nil)
    Group.calculate_group_averages(connection.user_id)
	 end
  end

end