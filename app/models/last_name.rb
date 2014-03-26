class LastName < ActiveRecord::Base
  has_many :users
  has_many :connections
end
