class Contact < ActiveRecord::Base
  has_one :linkedin
  has_many :connections
end
