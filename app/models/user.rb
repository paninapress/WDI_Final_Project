class User < ActiveRecord::Base
  belongs_to :first_name
  belongs_to :last_name
end
