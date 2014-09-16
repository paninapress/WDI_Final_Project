class Group < ActiveRecord::Base
	belongs_to  :user

	def self.calculate_group_average(id, category)
    user = User.find(id)
    sum = 0.0
    count = 0
    user.connections.each do |contact|
      if contact.health != nil && contact.category == category
        if contact.health >= 0
          sum += contact.health
          count += 1
        end
      end
    end
    if count == 0 #if no contact in this category has health to average in
        if category == 21
          user.group.update_attributes(averageOne: nil)
        elsif category == 42
          user.group.update_attributes(averageTwo: nil)
        elsif category == 90
          user.group.update_attributes(averageThree: nil)
        elsif category == 180
          user.group.update_attributes(averageFour: nil)
        end
    else
        average = sum/count
        if category == 21
          user.group.update_attributes(averageOne: average)
        elsif category == 42
          user.group.update_attributes(averageTwo: average)
        elsif category == 90
          user.group.update_attributes(averageThree: average)
        elsif category == 180
          user.group.update_attributes(averageFour: average)
        end
    end
  end

end
