class Group < ActiveRecord::Base
	belongs_to  :user

  	def self.calculate_group_averages(id)
  		g1 = {average: nil, sum: 0.0, count: 0}
	 	g2 = {average: nil, sum: 0.0, count: 0}
	 	g3 = {average: nil, sum: 0.0, count: 0}
	 	g4 = {average: nil, sum: 0.0, count: 0}
	 	overallHealth = {average: nil, sum: 0.0, count: 0}

        user = User.find(id)

	 	user.connections.each do |contact|
	 		if contact.health != nil
	 			if contact.category == 21 && contact.health >= 0
		            g1[:sum] += contact.health
		            g1[:count] += 1
		        elsif contact.category == 42 && contact.health >= 0
		            g2[:sum] += contact.health
		            g2[:count] += 1
		        elsif contact.category == 90 && contact.health >= 0
		            g3[:sum] += contact.health
		            g3[:count] += 1
		        elsif contact.category == 180 && contact.health >= 0
		            g4[:sum] += contact.health
		            g4[:count] += 1
                end
	 		end
	 	end

# calcOverallHealth is separate func becuase 
#   the groups are weighted differently: g1 is 2x of g2 
#   then g2 is 2x of g3 and so on...
        overallHealth[:sum] += (g1[:sum] * (2 ** 3)) # g1 weighted 2*2*2
        overallHealth[:sum] += (g2[:sum] * (2 ** 2)) # g2 weighted 2*2
        overallHealth[:sum] += (g3[:sum] * 2) # g3 weighted double
        overallHealth[:sum] += g4[:sum]

        overallHealth[:count] += (g1[:count] * (2 ** 3)) # g1 weighted 2*2*2
        overallHealth[:count] += (g2[:count] * (2 ** 2)) # g2 weighted 2*2
        overallHealth[:count] += (g3[:count] * 2) # g3 weighted double
        overallHealth[:count] += g4[:count]

# Then calculate and update attributes
        g1[:average] = calc_average(g1[:sum], g1[:count])
        g2[:average] = calc_average(g2[:sum], g2[:count])
        g3[:average] = calc_average(g3[:sum], g3[:count])
        g4[:average] = calc_average(g4[:sum], g4[:count])
        overallHealth[:average] = calc_average(overallHealth[:sum], overallHealth[:count])

        user.group.update_attributes(averageOne: g1[:average], averageTwo: g2[:average], averageThree: g3[:average], averageFour: g4[:average], averageOverall: overallHealth[:average])
  	end

    def self.calc_average(sum, count)
        if count > 0
            return sum / count
        else
            return nil
        end
    end

end